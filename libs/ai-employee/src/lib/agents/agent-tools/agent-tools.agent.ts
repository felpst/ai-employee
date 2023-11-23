import { IAIEmployee } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { AgentExecutor, initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import { MessagesPlaceholder } from "langchain/prompts";
import { Subject } from "rxjs";
import { Agent, CallProcess, CallResponse } from '../../../../../interfaces/src/agent.interface';
import { AIEmployeeTools } from "../../tools/ai-employee-tools";

export class AgentTools implements Agent {
  _executor: AgentExecutor;
  processes: CallProcess[];
  calls: CallResponse[] = [];
  $calls: Subject<CallResponse[]> = new Subject();

  constructor(
    private aiEmployee: IAIEmployee,
  ) { }

  async init() {
    const model = new ChatModel();
    const tools = AIEmployeeTools.get(this.aiEmployee.tools.map(({ type }) => type));

    this._executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: "structured-chat-zero-shot-react-description",
      // verbose: true,
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
