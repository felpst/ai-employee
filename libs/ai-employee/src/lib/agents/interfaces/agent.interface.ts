import { AgentExecutor } from "langchain/agents";

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
  init(): Promise<Agent>;
  call(input: string, callbacks?: unknown[]): Promise<string>;
}
