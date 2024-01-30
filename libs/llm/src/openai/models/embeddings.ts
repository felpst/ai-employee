import { AzureOpenAIInput } from 'langchain/chat_models/openai';
import {
  OpenAIEmbeddings as LangchainOpenAIEmbeddings,
  OpenAIEmbeddingsParams,
} from '@langchain/openai';
import { ClientOptions } from 'openai';

export class EmbeddingsModel extends LangchainOpenAIEmbeddings {
  constructor(
    fields?: Partial<OpenAIEmbeddingsParams> &
      Partial<AzureOpenAIInput> & {
        verbose?: boolean;
        openAIApiKey?: string;
      },
    configuration?: ClientOptions
  ) {
    super(
      {
        azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
        azureOpenAIApiInstanceName: process.env.AZURE_INSTANCE_NAME,
        azureOpenAIApiVersion: '2023-08-01-preview',
        azureOpenAIApiDeploymentName: 'embeddings',
        ...(fields && fields),
      },
      configuration
    );
  }
}
