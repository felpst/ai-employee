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
    const aiEmployee = conn.session.aiEmployee

    // Save input message
    const message = await this.chatMessageCreate.execute(data);
    conn.session.chatMessages.push(message);

    // Send message to client
    conn.messageSend.execute(conn, { type: 'message', content: message });

    // Message answer
    const answerMessage = await this.chatMessageCreate.execute({
      content: '',
      sender: conn.session.aiEmployee._id,
      role: 'bot',
      chatRoom: data.chatRoom,
      call: null
    });

    // agent.$calls.subscribe((calls) => {
    //   // Send calls to client
    //   conn.messageSend.execute(conn, {
    //     type: 'handleMessage', content: {
    //       ...answerMessage.toObject(),
    //       call: calls[calls.length - 1]
    //     }
    //   });
    // });

    // Send to AI Employee
    const agentCall = await aiEmployee.call(message.content);
    // console.log(answer);

    // Save answer
    answerMessage.content = agentCall.output;
    answerMessage.call = agentCall._id;
    await answerMessage.save()
    conn.session.chatMessages.push(answerMessage);

    // Send answer to client
    conn.messageSend.execute(conn, {
      type: 'message', content: {
        ...answerMessage.toObject(),
        call: agentCall
      }
    });

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
