import { IChatMessage, IChatRoom } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { Callbacks } from "langchain/callbacks";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";

export class ChatHelper {
  static async generateChatName(chatRoom: IChatRoom, messages: IChatMessage[], callbacks?: Callbacks | any) {
    if (chatRoom.name !== 'New chat') return;

    try {
      const model = new ChatModel();
      const prompt = PromptTemplate.fromTemplate(
        `Create a short name of chat conversation. The first message is: ${messages[0].content}. Response: ${messages[1].content}. Chat name: `
      );
      const chain = new LLMChain({ llm: model, prompt });
      const res = await chain.run({}, [
        {
          handleLLMNewToken: callbacks.handleLLMNewTokenChatName,
          handleChainEnd: callbacks.handleEndChatName,
        },
      ]);
      chatRoom.name = res.trim().replace(/"/g, '');
      await chatRoom.save();
      return chatRoom.name;
    } catch (error) {
      console.log('[chatName error]', error);
    }
  }
}
