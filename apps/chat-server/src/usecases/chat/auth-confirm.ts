import { IUser } from "@cognum/interfaces";
import { Connection } from "../websocket/connection.usecase";
import { MessageSend } from "../websocket/message-send.usecase";

export class AuthConfirm {

  constructor(
    private messageSend: MessageSend,
  ) { }

  execute(conn: Connection, user: IUser) {
    // console.log(`User ${user.name} authenticated`);
    this.messageSend.execute(conn, {
      type: 'auth',
      content: {
        isAuthenticated: true
      },
    });
  }
}
