import * as Amq from "amqplib";
import { Message } from "./message";
import { Result } from "@soapjs/soap";

export type MessageResultContent = {
  isSuccess: boolean;
  isFailure: boolean;
  error: Error;
  content: unknown;
};

export class MessageResult extends Message {
  static toResult(msg: Amq.Message) {
    const obj: MessageResultContent = JSON.parse(msg.content.toString());

    if (obj.isSuccess) {
      return Result.withContent(obj.content);
    }

    return Result.withFailure(obj.error);
  }

  static createSuccessResponse(queue: string, event: string, content: unknown) {
    return new MessageResult(queue, event, {
      isSuccess: true,
      isFailure: false,
      error: null,
      content,
    });
  }

  static createFailureResponse(queue: string, event: string, error: Error) {
    return new MessageResult(queue, event, {
      isSuccess: false,
      isFailure: true,
      error,
      content: null,
    });
  }
}
