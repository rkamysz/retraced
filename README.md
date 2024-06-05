# README - Category and Analytics Services

## Overview

This system consists of two main services:
1. **Categories Service**: Manages categories and their hierarchical relationships.
2. **Analytics Service**: Provides statistical data about categories, such as counting subcategories and top-level categories.

Both services communicate asynchronously via RabbitMQ, with `Categories Service` also acting as an API gateway to receive HTTP requests and send responses based on the analytics processed by the `Analytics Service`.

## Prerequisites

- Docker and Docker Compose
- Node.js environment
- Access to `container-registry.oracle.com/database/free:latest` for Oracle Database
- Access to a RabbitMQ server with management plugin

## Configuration

Create a `.env` file in the root directory of each service with the following environment variables:

```plaintext
CATEGORIES_PORT=3000

AMQ_USER=user
AMQ_PASSWORD=password
AMQ_URL=amqp://user:password@localhost
AMQ_CATEGORIES_CHANNEL=categories

ORACLE_DB_CONN_STRING=localhost:1521/FREEPDB1
ORACLE_DB_CONTAINER=FREEPDB1
ORACLE_DB_USER=appuser
ORACLE_DB_PASSWORD=oracle
```

Replace `user`, `password`, `localhost`, `appuser`, and `oracle` with actual values suitable for your environment.

## Setup Instructions

1. **Oracle Database Setup**:
   - Pull the Oracle image and run the container. Ensure that the SQL scripts in the `sql` directory are copied into the container and executed during the startup phase. Place scripts in the `/opt/oracle/scripts/startup` directory to ensure they are executed.

2. **RabbitMQ Setup**:
   - Ensure that RabbitMQ is running and accessible at the `AMQ_URL` specified. Configure the necessary queues (`analytics_requests` and `analytics_responses`) either manually through the management interface or via startup scripts.

3a. **Running the Services**:
   - Run `docker-compose up -d`
3b. **Running the Services (locally)**:
   - Run rabbitMQ and OracleDB in docker
   - Navigate to the service directory.
   - Install dependencies using `npm install`.
   - Start the service using `npm start`.
   - Ensure environment variables are correctly set as per your `.env` file (in service folder).

## API Endpoints

### Categories Service

- **POST `/categories`**
  - Adds a new category.
  - **Example**: `curl -X POST http://localhost:3000/categories -d '{"name": "New Category", "parent_id": 1}'`

- **DELETE `/categories/:id`**
  - Deletes a category. Add `?recursive=true` to delete all subcategories.
  - **Example**: `curl -X DELETE http://localhost:3000/categories/1?recursive=false`

- **GET `/categories/:id?type=json`**
  - Retrieves the category tree starting from the specified ID in JSON (or String Tree) format.
  - **Example**: `curl http://localhost:3000/categories/1?type=json`
  - **Example**: `curl http://localhost:3000/categories/1?type=string`

- **GET `/categories?type=string`**
  - Retrieves the full category tree in a string format.
  - **Example**: `curl http://localhost:3000/categories?type=string`

### Analytics Service

- **GET `/analytics`**
  - Returns the number of top-level categories.
  - **Example**: `curl http://localhost:3000/analytics`

- **GET `/analytics/:categoryId`**
  - Returns the number of subcategories for a given category ID.
  - **Example**: `curl http://localhost:3000/analytics/1`

## Important Note: Non-Production Ready Status

This implementation of the Categories and Analytics services is designed as a prototype or development base and is not ready for production deployment. Below are key considerations and enhancements required before this system can be considered production-ready:

### 1. **Testing**
   - **Unit Tests**: Implement comprehensive unit tests for each service to validate all functions and modules independently.
   - **Integration Tests**: Develop integration tests to ensure that the services interact correctly with each other and with external systems like RabbitMQ and Oracle Database.
   - **End-to-End Tests**: Set up end-to-end tests that simulate user interactions to ensure the system works as expected from start to finish.

### 2. **Documentation**
   - **API Documentation**: Document all API endpoints thoroughly using tools like Swagger or Postman. This documentation should include request examples, response examples, error codes, and descriptions.
   - **Developer Documentation**: Provide detailed developer documentation that covers system architecture, setup, configuration, and deployment processes.
   - **Operational Documentation**: Include operational and maintenance guides that describe regular tasks, such as database backups, monitoring, and performance tuning.

### 3. **Architecture Improvements**
   - **Use of an API Gateway**: Rather than having the Categories service double as an API gateway, implement a dedicated API Gateway. This would centralize the entry points for the services, providing a single place to manage authentication, rate limiting, and routing.
   - **Service Isolation**: Ensure that each service is loosely coupled and interacts with others through well-defined interfaces. This facilitates easier scaling, maintenance, and updates.
   - **Load Balancing**: Implement load balancing mechanisms to distribute incoming requests efficiently across multiple instances of the services to improve responsiveness and availability.

### 4. **Security Enhancements**
   - **Secure Communications**: Ensure that all communications between services and with the external world are encrypted using TLS.
   - **Authentication and Authorization**: Implement robust authentication and authorization mechanisms to control access to various parts of the system.
   - **Vulnerability Assessment**: Regularly perform security assessments and penetration testing to identify and mitigate potential security risks.

### 5. **Performance and Scalability**
   - **Performance Testing**: Conduct performance testing to identify potential bottlenecks and optimize performance before going live.
   - **Scalability Plan**: Develop a scalability strategy that includes horizontal scaling of services and databases to handle increased load dynamically.

### 6. **Error Handling and Logging**
   - **Robust Error Handling**: Implement comprehensive error handling across all services to manage and respond to errors gracefully.
   - **Advanced Logging**: Utilize advanced logging mechanisms to monitor the health of the system and to diagnose issues quickly.
