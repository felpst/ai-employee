import { AgentExecutor } from "langchain/agents";
import { Subject } from "rxjs";

export interface TaskProcess {
  tool: string;
  input: string;
  output: string;
  status: 'running' | 'done';
  taskTokenUsage: number;
}

export interface CallResponse {
  input: string;
  output: string;
  tasks: TaskProcess[];
  callTokenUsage: number;
  totalTokenUsage: number;
  status: 'running' | 'done';
}

export interface CallProcess {
  input: string;
  output: string;
  llmOutput: string;
  llmOutputFormatted: string;
  logs: any[];
  totalTokenUsage: number;
}
export interface Agent {
  _executor: AgentExecutor;
  processes: CallProcess[]
  calls: CallResponse[]
  $calls: Subject<CallResponse[]>;
  init(): Promise<Agent>;
  call(input: string, callbacks?: unknown[]): Promise<CallResponse>;
}
