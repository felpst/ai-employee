import { Connection } from "./connection.usecase";
import { MessageSend } from "./message-send.usecase";

export class ConnectionConfirm {

  constructor(
    private messageSend: MessageSend,
  ) { }

  execute(conn: Connection) {
    this.messageSend.execute(conn, {
      type: 'connection',
      content: {
        isConnected: true,
        sessionId: conn.session.id,
        chatMessages: conn.session.chatMessages,
        senders: conn.session.senders,
      },
    });
  }
}
