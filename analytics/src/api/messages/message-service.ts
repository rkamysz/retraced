import { AnyFunction } from "@soapjs/soap";
import { Message } from "./message";
/**
 * Interface for a message service that handles messaging operations.
 */
export interface MessageService {
  /**
   * Initializes the message service.
   *
   * This method should set up any necessary connections or configurations
   * required for the message service to operate.
   */
  init();

  /**
   * Closes the message service.
   *
   * This method should close any open connections and clean up resources
   * used by the message service.
   */
  close();

  /**
   * Sends a message.
   *
   * This method takes a message object and sends it to the appropriate
   * destination.
   *
   * @param {Message} message - The message object to be sent.
   */
  sendMessage(message: Message);

  /**
   * Listens for messages from a specified queue.
   *
   * This method sets up a listener on the specified queue and executes the
   * provided callback function when a message is received.
   *
   * @param {string} queue - The name of the queue to listen to.
   * @param {AnyFunction} callback - The function to be called when a message is received.
   * @param {Object} options - Options for the listener.
   * @param {boolean} options.noAck - Whether to acknowledge messages automatically.
   * @param {Object} options.[key: string] - Additional options for the listener.
   */
  listen(
    queue: string,
    callback: AnyFunction,
    options: { noAck: boolean; [key: string]: unknown }
  );
}
