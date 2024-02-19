import { ChatModel } from "@cognum/llm";
import { AgentExecutor, initializeAgentExecutorWithOptions } from "langchain/agents";
import { Tool } from "@langchain/core/tools";

export class ToolExecutionAgent {
  private _executor: AgentExecutor;

  constructor(
    private tools: Tool[] = []
  ) { }

  async init() {
    this._executor = await this.executor();
    return this;
  }

  async run(input: string): Promise<string> {
    try {
      const result = await this._executor.call({ input });
      return result.output;
    } catch (error) {
      console.error('[Tool Execution Run]', error.message);
      return error.message;
    }
  }

  private async executor() {
    const model = new ChatModel();
    const executor = await initializeAgentExecutorWithOptions(this.tools, model, {
      agentType: "zero-shot-react-description",
      // verbose: true,
    });
    return executor;
  }
}
