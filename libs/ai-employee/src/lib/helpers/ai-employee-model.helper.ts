import { ChatModel } from "@cognum/llm";
import { BaseChatModelParams } from "langchain/chat_models/base";
import { AzureOpenAIInput, OpenAIChatInput } from "langchain/chat_models/openai";


export class AIEmployeeModelHelper {

  static chatModel(fields?: Omit<
    Partial<OpenAIChatInput> &
    Partial<AzureOpenAIInput> &
    BaseChatModelParams,
    'modelName' | 'azureOpenAIApiDeploymentName'
  >) {
    const configChatModel = {
      streaming: true,
      ...fields
    };
    return new ChatModel(configChatModel);
  }

}
