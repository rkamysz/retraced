import { AnyObject } from "@soapjs/soap";

/**
 * Represents a message to be used within the messaging system.
 */
export class Message {
  private _correlationId: string;
  /**
   * Creates an instance of Message.
   *
   * @param {string} queue - The name of the queue to which the message belongs.
   * @param {string} event - The event type associated with the message.
   * @param {AnyObject} rawData - The raw data contained in the message.
   * @param {string} correlationId - The correlation ID for the message.
   */
  constructor(
    public readonly queue: string,
    public readonly event: string,
    public readonly rawData: AnyObject,
    correlationId?: string
  ) {
    if (!correlationId) {
      this._correlationId = this.generateCorrelationId();
    }
  }

  get correlationId(): string {
    return this._correlationId;
  }

  /**
   * Converts the message raw data to a string.
   *
   * @returns {string} The string representation of the raw data.
   */
  toString() {
    return JSON.stringify(this.rawData);
  }

  /**
   * Converts the message raw data to a Buffer.
   *
   * @returns {Buffer} The Buffer representation of the raw data.
   */
  toBuffer() {
    return Buffer.from(this.toString());
  }

  protected generateCorrelationId = () => {
    return Math.random().toString() + new Date().getTime().toString();
  };
}
