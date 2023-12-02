import { AgentExecutor } from "langchain/agents";
import { ObjectId } from "mongodb";
import { Subject } from "rxjs";
import { IAIEmployee } from "./ai-employee.interfaces";
import { DefaultModel } from "./default.model";

export interface TaskProcess {
  tool: string;
  input: string;
  output: string;
  status: 'running' | 'done';
  taskTokenUsage: number;
  startAt: Date;
  endAt: Date;
}

export interface IAgentCall extends DefaultModel {
  input: string;
  output: string;
  tasks: TaskProcess[];
  callTokenUsage: number;
  totalTokenUsage: number;
  status: 'running' | 'done';
  startAt: Date;
  endAt: Date;
  intent: string;
  agent: string;
  aiEmployee: string | ObjectId | IAIEmployee;
}

export interface CallProcess {
  input: string;
  output: string;
  llmOutput: string;
  llmOutputFormatted: string;
  logs: any[];
  totalTokenUsage: number;
}
export interface IAgent {
  aiEmployee: IAIEmployee;
  _executor?: AgentExecutor;
  processes?: CallProcess[]
  calls?: IAgentCall[]
  $calls?: Subject<IAgentCall[]>;
  init(): Promise<any>;
  call(input: string, intent: string, callbacks?: unknown[]): Promise<IAgentCall>;
}
