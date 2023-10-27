import { Types } from "mongoose";

import { ChatModel } from '@cognum/llm';
import {
  AIEmployeeMemory,
  AIEmployeeOutputParser,
  KnowledgeBaseTool
} from '@cognum/tools';
import { AgentExecutor, LLMSingleActionAgent } from 'langchain/agents';
import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { Callbacks } from 'langchain/dist/callbacks';
import { Tool } from 'langchain/tools';
import { Calculator } from 'langchain/tools/calculator';

export interface IAiEmployee {
  id?: string | Types.ObjectId;
  name: string;
  profession: string;
  callbacks: Callbacks;
  chain: LLMChain;
}

export interface IAiEmployeeModel {
  id?: string | Types.ObjectId;
  name: string;
  profession: string;
}

export interface IAiEmployeeDTO {
  name?: string;
  profession?: string;
}

export class AiEmployeeModel implements IAiEmployeeModel {
  id = Math.random().toString(36).substring(2, 9);
  name = '';
  profession = '';
  constructor(params: Partial<IAiEmployee> = {}) {
    Object.assign(this, params);
  }
}

export class AiEmployee implements IAiEmployee {
  id = Math.random().toString(36).substring(2, 9);
  name = '';
  profession = '';
  callbacks: Callbacks;
  chain: LLMChain;
  memory: AIEmployeeMemory;
  private _model: ChatOpenAI;
  private _tools: Tool[];
  private _agent: LLMSingleActionAgent;
  private _executor: AgentExecutor;

  constructor(params: Partial<IAiEmployee> = {}) {
    Object.assign(this, params);

    const configChatModel = {
      streaming: true,
      callbacks: this.callbacks,
      // verbose: true,
    }
    
    this._model = new ChatModel(configChatModel)
  
    this._tools = [
      // new DatabaseConnect(),
      // new SerpAPI(process.env.SERPAPI_API_KEY),
      new Calculator(),
      // new ChatHistoryTool(this.memory),
      // new ZapierTool(),
      new KnowledgeBaseTool(),
    ];

    this._agent = new LLMSingleActionAgent({
      llmChain: this.chain,
      outputParser: new AIEmployeeOutputParser(),
      stop: ['\nObservation'],
    });

    this._executor = new AgentExecutor({
      agent: this._agent,
      tools: this._tools,
    });
  }
}

export class AiEmployeeDTO implements IAiEmployeeDTO {
  name?: string
  role?: string;

  constructor(params: Partial<IAiEmployeeDTO> = {}) {
   params.name ? this.name = params.name : undefined;
   params.profession ? this.role = params.profession : undefined;
  }
}
