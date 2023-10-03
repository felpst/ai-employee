import axios, { AxiosRequestConfig } from "axios";

export type OpenAIModel = 'gpt-4' | 'gpt-3.5-turbo';

export enum OpenAIRole {
  System = 'system',
  Assistant = 'assistant',
  User = 'user'
}
export interface OpenAIMessage {
  role: string | OpenAIRole;
  content: string;
}

export interface OpenAICompletionParams {
  model?: OpenAIModel;
  messages: OpenAIMessage[];
}

export interface OpenAIResponseData {
  id: string
  choices: {
    message: {
      content: string
    }
  }[]
}

export class OpenAIHelper {
  static readonly baseUrl = "https://api.openai.com/v1";

  constructor() {}

  static async completion(params: OpenAICompletionParams): Promise<OpenAIResponseData> {
    const requestConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
      },
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        params,
        requestConfig
      );

      return response.data as OpenAIResponseData;
    } catch (error) {
      // console.error("Error completing chat:", error);
      console.log(JSON.stringify(error.response.data));      
      throw new Error("Failed to complete chat");
    }
  }
}

export default new OpenAIHelper()