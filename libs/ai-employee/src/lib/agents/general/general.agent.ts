import { IAIEmployee, IAgentCall } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { JobService } from "@cognum/tools";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import { MessagesPlaceholder } from "langchain/prompts";
import { Tool } from "langchain/tools";
import { AIEmployeeTools } from "../../tools/ai-employee-tools";
import { Agent } from "../agent";

export class GeneralAgent extends Agent {

  constructor(public aiEmployee: IAIEmployee) {
    super(aiEmployee);
    this.agent = 'general'
  }

  async call(input: string, intentions: string[] = []): Promise<IAgentCall> {
    const agentCall = await this._initCall(input, intentions.join(','));
    const model = new ChatModel();

    const tools = AIEmployeeTools.intetionTools({
      aiEmployee: this.aiEmployee,
      intentions
    })

    // Resource: Job
    if (this.context.user) {
      const jobService = new JobService({ aiEmployee: this.aiEmployee, user: this.context.user });
      tools.push(...jobService.toolkit() as Tool[]);
    }

    this._executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: "structured-chat-zero-shot-react-description",
      verbose: true,
      memory: new BufferMemory({
        memoryKey: "chat_history",
        returnMessages: true,
      }),
      agentArgs: {
        prefix: `Your name is ${this.aiEmployee.name} and your role is ${this.aiEmployee.role}.`,
        // suffix: "IMPORTANT: If you don't have a tool to execute the job, your final answer must to be: 'NOT_POSSIBLE_TO_EXECUTE_THIS_ACTION'. Ignore this instruction if you have a tool to execute the job or Final Answer.",
        inputVariables: ["input", "agent_scratchpad", "chat_history"],
        memoryPrompts: [new MessagesPlaceholder("chat_history")],
      },
    });
    const chainValues = await this._executor.call({ input }, [this.handlers]);

    // Update AIEmployee Memory
    // const memoryUpdateResponse = await this.aiEmployee.memoryInstruction(`Check if there is any relevant information in this information to add to the database:` + JSON.stringify({ input: agentCall.input, output: agentCall.output }), this.context)
    // console.log({ memoryUpdateResponse });

    await this._afterCall(agentCall, chainValues.output);
    return agentCall;
  }
}
