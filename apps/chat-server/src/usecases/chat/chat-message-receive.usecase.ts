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

    // Send to AI Employee
    const call = await aiEmployee.call({
      input: message.content,
      createdBy: conn.session.user._id,
      updatedBy: conn.session.user._id,
      context: {
        chatRoom: conn.session.chatRoom._id,
        chatMessages: conn.session.chatMessages.map(m => ({
          _id: m._id,
          content: m.content,
          role: m.role,
          sender: m.sender
        })),
      }
    });
    // console.log(answer);

    // Message answer
    const answerMessage = await this.chatMessageCreate.execute({
      content: '',
      sender: conn.session.aiEmployee._id,
      role: 'bot',
      chatRoom: data.chatRoom,
      call: call._id
    });

    // Run
    call.run().subscribe(async (call) => {
      // Send call to client
      conn.messageSend.execute(conn, {
        type: 'handleMessage', content: {
          ...answerMessage.toObject(),
          call: call.toObject()
        }
      });

      if (call.status === 'done') {
        // Save answer
        answerMessage.content = call.output;
        await answerMessage.save()
        conn.session.chatMessages.push(answerMessage);

        // Send final message
        conn.messageSend.execute(conn, {
          type: 'message', content: {
            ...answerMessage.toObject(),
            call: call.toObject()
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
    });


  }

}
