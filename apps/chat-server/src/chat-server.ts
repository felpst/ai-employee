import { ChatMessageCreate, ChatMessageRepository, ChatRoomRepository } from "@cognum/chat";
import { IAIEmployee, IUser } from "@cognum/interfaces";
import { IncomingMessage } from "http";
import * as url from 'url';
import { webSocketService } from "./services/websocket.service";
import { AuthConfirm } from "./usecases/chat/auth-confirm";
import { Auth } from "./usecases/chat/auth.usecase";
import { ChatMessageReceive } from "./usecases/chat/chat-message-receive.usecase";
import { MessageReceive } from "./usecases/chat/message-receive.usecase";
import { Connection } from "./usecases/websocket/connection.usecase";

export class ChatServer {
  private chatRoomRepository = new ChatRoomRepository();
  private chatMessageRepository = new ChatMessageRepository();
  private messageReceive = new MessageReceive(
    new ChatMessageReceive(
      new ChatMessageCreate(this.chatMessageRepository)
    )
  );

  run() {
    webSocketService.connection(async (conn: Connection, request: IncomingMessage) => {
      try {
        // Check params
        const { chatRoomId, token } = url.parse(request.url, true).query as { chatRoomId: string, token: string };
        if (!chatRoomId) { throw new Error('Chat Room ID not found'); }
        if (!token) { throw new Error('Token not found'); }

        // Auth
        const auth = new Auth(
          conn.connectionClose,
          new AuthConfirm(conn.messageSend)
        );
        await auth.execute(conn, { token });

        // Load Chat
        const chatRoom = await this.chatRoomRepository.getById(chatRoomId, {
          populate: [{ path: 'aiEmployee', select: '_id name role avatar tools workspace memory' }]
        });

        if (!chatRoom) { throw new Error('Chat Room not found'); }
        conn.setChatRoom(chatRoom);

        // Load Messages
        const chatMessages = await this.chatMessageRepository.find({
          filter: { chatRoom: chatRoomId },
          populate: [{ path: 'call' }],
          sort: 'createdAt',
        });
        conn.setChatMessages(chatMessages);

        // Load AI Employee
        const aiEmployee = chatRoom.aiEmployee as IAIEmployee;
        conn.setAIEmployee(aiEmployee);

        // Load senders
        const senders: (IUser | IAIEmployee)[] = [conn.session.user, aiEmployee];
        conn.setSenders(senders);

        // Listeners
        conn.session.socket.onmessage = (event) => {
          this.messageReceive.execute(conn, event.data);
        };

        // Confirm connection
        conn.confirm();
      } catch (error) {
        conn.close(error.message);
      }
    });
    webSocketService.run();
  }

}
