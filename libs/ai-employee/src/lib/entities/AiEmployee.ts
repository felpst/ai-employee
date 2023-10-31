import { Types } from "mongoose";

import { IUser } from '@cognum/interfaces';
import {
  AIEmployeeMemory,
  AIEmployeeOutputParser,
  AIEmployeePromptTemplate,
  KnowledgeBaseTool
} from '@cognum/tools';
import { AgentExecutor, LLMSingleActionAgent } from 'langchain/agents';
import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { Callbacks } from 'langchain/dist/callbacks';
import { Tool } from 'langchain/tools';
import { Calculator } from 'langchain/tools/calculator';

export interface IAiEmployee {
  profile: IAiEmployeeProfile;
  _model: ChatOpenAI;
  memory?: AIEmployeeMemory;
  callbacks?: Callbacks;
}

export interface IAiEmployeeProfile {
  _id?: string | Types.ObjectId;
  name: string;
  profession: string;
}

export interface IAiEmployeeDTO {
  name?: string;
  profession?: string;
}

export class AiEmployeeProfile implements IAiEmployeeProfile {
  _id = Math.random().toString(36).substring(2, 9);
  name = '';
  profession = '';

  constructor(params: Partial<IAiEmployeeProfile> = {}) {
    Object.assign(this, params);
  }
}

export class AiEmployee implements IAiEmployee {
  profile: IAiEmployeeProfile;
  callbacks: Callbacks;
  memory: AIEmployeeMemory;
  _executor: AgentExecutor;
  _model: ChatOpenAI;
  private chain: LLMChain;
  private _tools: Tool[];
  private _agent: LLMSingleActionAgent;

  constructor(params: Partial<IAiEmployee> = {}) {
    Object.assign(this, params);
    
    this._model = params._model

    this.memory = params.memory
  
    this._tools = [
      // new DatabaseConnect(),
      // new SerpAPI(process.env.SERPAPI_API_KEY),
      new Calculator(),
      // new ChatHistoryTool(this.memory),
      // new ZapierTool(),
      new KnowledgeBaseTool(),
    ];


    // toDo: remove this _user from here
    const _user = {
      _id: "65401efc97740ada74d29cb4",
      name: 'VENILTON',
      email: 'venilton@cognum.ai',
      password: '$2b$10$xxkBKIpQyxdDGwXnyQGacu5YqrlwIsL96rRX0uqhpORZOwR721xXe',
      createdAt: new Date('2023-10-30T21:24:12.953Z'),
      updatedAt: new Date('2023-10-30T21:24:12.956Z'),
      __v: 0
    }

    this.chain = new LLMChain({
      llm: this._model,
      prompt: new AIEmployeePromptTemplate({
        tools: this._tools,
        inputVariables: ['input', 'agent_scratchpad', 'intermediate_steps'],
        identity: this.profile,
        memory: this.memory,
        // toDo: remove this _user from here
        user: _user as IUser
      }),
    });

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
  profession?: string;

  constructor(params: Partial<IAiEmployeeDTO> = {}) {
   params.name ? this.name = params.name : undefined;
   params.profession ? this.profession = params.profession : undefined;
  }
}
