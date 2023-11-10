import { IAIEmployee } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { AgentExecutor, initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import { MessagesPlaceholder } from "langchain/prompts";
import { AIEmployeeTools } from "../../tools/ai-employee-tools";
import { Agent } from '../interfaces/agent.interface';

export class AgentTools implements Agent {
  _executor: AgentExecutor;

  constructor(
    private aiEmployee: IAIEmployee,
  ) { }

  async init() {
    const model = new ChatModel();
    const tools = AIEmployeeTools.get(this.aiEmployee.tools);

    this._executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: "structured-chat-zero-shot-react-description",
      verbose: true,
      memory: new BufferMemory({
        memoryKey: "chat_history",
        returnMessages: true,
      }),
      agentArgs: {
        suffix: "IMPORTANT: If you don't have a tool for the main job, your final answer must to be: 'NOT_POSSIBLE_TO_EXECUTE_THIS_ACTION'.",
        inputVariables: ["input", "agent_scratchpad", "chat_history"],
        memoryPrompts: [new MessagesPlaceholder("chat_history")],
      },
    });

    return this;
  }

  async call(input: string, callbacks: unknown[] = []) {
    const chainValues = await this._executor.call({ input }, [...callbacks]);
    const response = chainValues.output;
    return response;
  }

}
