import { IMessage } from "../../interfaces/message.interface";
import { Connection } from "./connection.usecase";

export class MessageSend {
  execute(conn: Connection, message: IMessage) {
    try {
      conn.session.socket.send(JSON.stringify(message));
    } catch (error) {
      console.error('MessageSend.execute: ', error.message)
    }
  }
}
