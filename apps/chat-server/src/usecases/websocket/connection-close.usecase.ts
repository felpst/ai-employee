import { Connection } from "./connection.usecase";
import { MessageSend } from "./message-send.usecase";

export class ConnectionClose {

  constructor(
    private messageSend: MessageSend
  ) { }

  execute(conn: Connection, message = 'Connection closed') {
    try {
      const session = conn.session;

      this.messageSend.execute(conn, {
        type: 'connection',
        content: { sessionId: session.id, isConnected: false, message },
      });
      session.socket.close();
      console.log(`Closed session with id ${session.id}`, message);
    } catch (error) {
      console.error(error.message);
    }
  }
}
