import { ChatMessageCreate } from "@cognum/chat";
import { IChatMessage } from "@cognum/interfaces";
import { Connection } from "../websocket/connection.usecase";

export class ChatMessageReceive {

  constructor(
    private chatMessageCreate: ChatMessageCreate
  ) { }

  async execute(conn: Connection, data: IChatMessage) {
    // Save input message
    const message = await this.chatMessageCreate.execute(data);

    // Send message to client
    conn.messageSend.execute(conn, { type: 'message', content: message });

    // Send to AI Employee
    const answer = await conn.session.agent.call(message.content);
    console.log(answer);

    // Listener to answer

    // Save answer
    const answerMessage = await this.chatMessageCreate.execute({
      content: answer,
      sender: conn.session.aiEmployee._id,
      role: 'bot',
      chatRoom: data.chatRoom
    });

    // Send answer to client
    conn.messageSend.execute(conn, { type: 'message', content: answerMessage });

    // Listener to new token
    // Send new token to client
  }
}
