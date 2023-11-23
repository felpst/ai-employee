import { ChatMessageCreate } from "@cognum/chat";
import { IChatMessage } from "@cognum/interfaces";
import { ChatHelper } from "../../helpers/chat.helper";
import { Connection } from "../websocket/connection.usecase";

export class ChatMessageReceive {

  constructor(
    private chatMessageCreate: ChatMessageCreate,
    // private aiEmployeeCall: AIEmployeeCall
  ) { }

  async execute(conn: Connection, data: IChatMessage) {
    const agent = conn.session.agent

    // Save input message
    const message = await this.chatMessageCreate.execute(data);
    conn.session.chatMessages.push(message);

    // Send message to client
    conn.messageSend.execute(conn, { type: 'message', content: message });

    // Listener to new token
    let lastTokensSent = ''
    const callbacks = [
      {
        handleLLMNewToken: () => {
          const processLength = agent.processes.length;
          if (processLength) {
            const llmOutputFormatted = agent.processes[processLength - 1].llmOutputFormatted;
            if (llmOutputFormatted && llmOutputFormatted !== lastTokensSent) {
              lastTokensSent = llmOutputFormatted;
              conn.messageSend.execute(conn, { type: 'handleLLMNewToken', content: llmOutputFormatted });
            }
          }
        },
        handleChainEnd: () => {
          // TODO save last process on message
          const lastProcess = agent.processes[agent.processes.length - 1];
          conn.messageSend.execute(conn, { type: 'handleChainEnd', content: lastProcess });
          lastTokensSent = '';
        }
      }
    ];

    agent.$calls.subscribe((calls) => {
      // Send calls to client
      conn.messageSend.execute(conn, { type: 'call-progress', content: calls[calls.length - 1] });
    });

    // Send to AI Employee
    const response = await agent.call(message.content, callbacks);
    // console.log(answer);

    // Save answer
    const answerMessage = await this.chatMessageCreate.execute({
      content: response.output,
      sender: conn.session.aiEmployee._id,
      role: 'bot',
      chatRoom: data.chatRoom
    });
    conn.session.chatMessages.push(answerMessage);

    // Send answer to client
    conn.messageSend.execute(conn, { type: 'message', content: answerMessage });

    // Chat name
    if (conn.session.chatRoom.name === 'New chat') {
      await ChatHelper.generateChatName(conn.session.chatRoom, conn.session.chatMessages, {
        handleLLMNewTokenChatName: (token: string) => {
          // Send chat name token to client
          token = token.trim().replace(/"/g, '');
          conn.messageSend.execute(conn, { type: 'handleLLMNewTokenChatName', content: token });
        },
        handleEndChatName: (outputs: any) => {
          const chatName = outputs.text.trim().replace(/"/g, '');
          conn.session.chatRoom.name = chatName;
          // Send chat name to client
          conn.messageSend.execute(conn, { type: 'handleEndChatName', content: chatName });
        }
      })
    }
  }

}
