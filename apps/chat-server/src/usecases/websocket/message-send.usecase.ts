import { IMessage } from "../../interfaces/message.interface";
import { Connection } from "./connection.usecase";

export class MessageSend {
  execute(conn: Connection, message: IMessage) {
    conn.session.socket.send(JSON.stringify(message));
  }
}
