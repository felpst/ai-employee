import { AgentExecutor } from "langchain/agents";

export interface Agent {
  _executor: AgentExecutor;
  init(): Promise<Agent>;
  call(input: string, callbacks?: unknown[]): Promise<string>;
}
