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
    conn.messageSend.execute(conn, {
      type: 'message',
      content: message,
    });



    // Send to AI Employee

    // Listener to answer
    // Save answer
    // Send answer to client

    // Listener to new token
    // Send new token to client
  }
}
