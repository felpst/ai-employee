import express from 'express';
import { Server as HTTPServer, IncomingMessage, createServer } from 'http';
import { WebSocket, Server as WebSocketServer } from 'ws';
import { ConnectionClose } from '../usecases/websocket/connection-close.usecase';
import { ConnectionConfirm } from '../usecases/websocket/connection-confirm';
import { Connection } from '../usecases/websocket/connection.usecase';
import { MessageSend } from '../usecases/websocket/message-send.usecase';
import { SessionClose } from '../usecases/websocket/session-close.usecase';
import { SessionCreate } from '../usecases/websocket/session-create.usecase';

class WebSocketService {
  private app = express();
  private port = process.env.PORT_CHAT || 8081;

  private httpServer: HTTPServer;
  private webSocketServer: WebSocketServer;

  constructor() {
    this.app.get('/readiness_check', (req, res) => {
      res.status(200).send();
    });
    this.app.get('/liveness_check', (req, res) => {
      res.status(200).send();
    });

    this.httpServer = createServer(this.app);
    this.webSocketServer = new WebSocketServer({
      server: this.httpServer,
    });
  }

  run(
    callback: () => void = () => {
      console.log(`WebSocketServer is running on port ${this.port}`);
    }
  ) {
    this.httpServer.listen(this.port, callback);
  }

  connection(callback?: (conn: Connection, request: IncomingMessage) => void) {
    return this.webSocketServer.on(
      'connection',
      async (webSocket: WebSocket, request: IncomingMessage) => {
        // Use cases
        const sessionCreate = new SessionCreate(webSocket);
        const sessionClose = new SessionClose();
        const messageSend = new MessageSend();
        const connectionConfirm = new ConnectionConfirm(messageSend);
        const connectionClose = new ConnectionClose(messageSend);

        // Use case composition
        const connection = new Connection(
          sessionCreate,
          sessionClose,
          connectionConfirm,
          connectionClose,
          messageSend
        );

        // Execute use case
        await connection.execute();

        // Callback
        if (callback) callback(connection, request);
      }
    );
  }
}

const webSocketService = new WebSocketService();
export { webSocketService };

