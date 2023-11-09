import { Data } from "ws";
import { IMessage } from "../../interfaces/message.interface";
import { Connection } from "../websocket/connection.usecase";
import { ChatMessageReceive } from "./chat-message-receive.usecase";

export class MessageReceive {

  constructor(
    private chatMessageReceive: ChatMessageReceive,
  ) { }

  async execute(conn: Connection, data: Data) {
    const message: IMessage = JSON.parse(data.toString());

    switch (message.type) {
      case 'message':
        await this.chatMessageReceive.execute(conn, message.content);
        break;

      default:
        break;
    }
  }
}
