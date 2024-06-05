#!/bin/bash
echo "Create tables ..."

sqlplus / as sysdba <<EOF
ALTER SESSION SET CONTAINER=$ORACLE_DB_CONTAINER;

CREATE TABLE $ORACLE_DB_USER.categories (
    id NUMBER GENERATED ALWAYS AS IDENTITY,
    name VARCHAR2(255) NOT NULL,
    parent_id NUMBER,
    CONSTRAINT pk_categories PRIMARY KEY (id),
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id)
        REFERENCES $ORACLE_DB_USER.categories (id)
        ON DELETE SET NULL
);

CREATE TABLE $ORACLE_DB_USER.analytics (
    category_id NUMBER NOT NULL,
    subcategory_count NUMBER DEFAULT 0,
    CONSTRAINT fk_analytics_category FOREIGN KEY (category_id)
        REFERENCES $ORACLE_DB_USER.categories (id)
        ON DELETE CASCADE
);
EOF

if [ $? -eq 0 ]; then
    echo "Done."
else
    echo "Failed."
fi
