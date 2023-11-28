<<<<<<< HEAD
import { IToolSettings } from "@cognum/interfaces";
=======
import { IAIEmployee } from "@cognum/interfaces";
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
import { ChatModel } from "@cognum/llm";
import { AgentExecutor, initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import { MessagesPlaceholder } from "langchain/prompts";
<<<<<<< HEAD
import { Subject } from "rxjs";
import { Agent, CallProcess, IAgentCall } from '../../../../../interfaces/src/agent.interface';
import { AIEmployeeTools } from "../../tools/ai-employee-tools";
=======
import { AIEmployeeTools } from "../../tools/ai-employee-tools";
import { Agent, CallProcess } from '../interfaces/agent.interface';
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe

export class AgentTools implements Agent {
  _executor: AgentExecutor;
  processes: CallProcess[];
<<<<<<< HEAD
  calls: IAgentCall[] = [];
  $calls: Subject<IAgentCall[]> = new Subject();

  constructor(
    private toolsSettings: IToolSettings[] = []
=======

  constructor(
    private aiEmployee: IAIEmployee,
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
  ) { }

  async init() {
    const model = new ChatModel();
<<<<<<< HEAD
    const tools = AIEmployeeTools.get(this.toolsSettings);
=======
    const tools = AIEmployeeTools.get(this.aiEmployee.tools);
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe

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
