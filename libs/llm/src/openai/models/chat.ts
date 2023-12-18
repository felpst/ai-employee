import {
  BaseCallbackHandler,
  CallbackHandlerMethods,
} from 'langchain/callbacks';
import { BaseChatModelParams } from 'langchain/chat_models/base';
import {
  AzureOpenAIInput,
  ChatOpenAI as LangchainChatOpenAI,
  OpenAIChatInput,
} from 'langchain/chat_models/openai';
import { LLMCallbackHandler } from '../callbacks/callback.handler';

export class ChatModel extends LangchainChatOpenAI {
  constructor(
    fields?: Omit<
      Partial<OpenAIChatInput> &
      Partial<AzureOpenAIInput> &
      BaseChatModelParams,
      'modelName' | 'azureOpenAIApiDeploymentName'
    >
  ) {
    const azureOpenAIApiDeploymentName = 'gpt-4';

    const callbacks: (BaseCallbackHandler | CallbackHandlerMethods)[] = [
      new LLMCallbackHandler(),
    ];

    if (fields?.callbacks) {
      for (const callback of fields?.callbacks as (
        | BaseCallbackHandler
        | CallbackHandlerMethods
      )[]) {
        callbacks.push(callback);
      }
    }

    super({
      azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
      azureOpenAIApiInstanceName: process.env.AZURE_INSTANCE_NAME,
      azureOpenAIApiVersion: '2023-05-15',
      azureOpenAIApiDeploymentName,
      temperature: 0,
      ...(fields && fields),
      verbose: false,
      streaming: true,
      callbacks,
    });
  }
}
