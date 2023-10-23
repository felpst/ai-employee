import { BaseChatModelParams } from 'langchain/chat_models/base';
import {
  AzureOpenAIInput,
  ChatOpenAI as LangchainChatOpenAI,
  OpenAIChatInput,
} from 'langchain/chat_models/openai';
import { BaseLLMParams } from 'langchain/dist/llms/base';
import { LegacyOpenAIInput } from 'langchain/dist/types/openai-types';
import {
  OpenAIEmbeddings as LangchainOpenAIEmbeddings,
  OpenAIEmbeddingsParams,
} from 'langchain/embeddings/openai';
import { OpenAI as LangchainOpenAI, OpenAIInput } from 'langchain/llms/openai';
import { ClientOptions } from 'openai';

export enum OpenAIModel {
  GPT35 = 'gpt-35',
  GPT4 = 'gpt-4',
  Embeddings = 'embeddings',
}

type AzureModelInclusion = {
  model?: OpenAIModel;
};

export class OpenAI extends LangchainOpenAI {
  constructor(
    fields?: Omit<
      Partial<OpenAIInput> &
        Partial<AzureOpenAIInput> &
        BaseLLMParams & {
          configuration?: ClientOptions & LegacyOpenAIInput;
        },
      'modelName' | 'azureOpenAIApiDeploymentName'
    > &
      AzureModelInclusion
  ) {
    const azureOpenAIApiDeploymentName = fields.model || OpenAIModel.GPT35;
    delete fields?.model;

    super({
      azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
      azureOpenAIApiInstanceName: process.env.AZURE_INSTANCE_NAME,
      azureOpenAIApiVersion: process.env.AZURE_VERSION,
      azureOpenAIApiDeploymentName,
      ...(fields && fields),
    });
  }
}

export class ChatOpenAI extends LangchainChatOpenAI {
  constructor(
    fields?: Omit<
      Partial<OpenAIChatInput> &
        Partial<AzureOpenAIInput> &
        BaseChatModelParams,
      'modelName' | 'azureOpenAIApiDeploymentName'
    > &
      AzureModelInclusion
  ) {
    const azureOpenAIApiDeploymentName = fields.model || OpenAIModel.GPT35;
    delete fields?.model;

    super({
      azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
      azureOpenAIApiInstanceName: process.env.AZURE_INSTANCE_NAME,
      azureOpenAIApiVersion: process.env.AZURE_VERSION,
      azureOpenAIApiDeploymentName,
      ...(fields && fields),
    });
  }
}

export class OpenAIEmbeddings extends LangchainOpenAIEmbeddings {
  constructor(
    fields?: Partial<OpenAIEmbeddingsParams> &
      Partial<AzureOpenAIInput> & {
        verbose?: boolean;
        openAIApiKey?: string;
      },
    configuration?: ClientOptions & LegacyOpenAIInput
  ) {
    super(
      {
        azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
        azureOpenAIApiInstanceName: process.env.AZURE_INSTANCE_NAME,
        azureOpenAIApiVersion: process.env.AZURE_VERSION,
        azureOpenAIApiDeploymentName: OpenAIModel.Embeddings,
        ...(fields && fields),
      },
      configuration
    );
  }
}
