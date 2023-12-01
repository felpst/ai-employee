import { IAIEmployee, IAgentCall } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { Agent } from "../agent";

export class GeneralAgent extends Agent {

  constructor(public aiEmployee: IAIEmployee) {
    super(aiEmployee);
    this.agent = 'general'
  }

  async call(input: string): Promise<IAgentCall> {
    const agentCall = await this._initCall(input);

    const model = new ChatModel();
    this._executor = await initializeAgentExecutorWithOptions([], model, {
      agentType: "chat-conversational-react-description",
      agentArgs: {
        systemMessage: `Your name is ${this.aiEmployee.name} and your role is ${this.aiEmployee.role}.`
      }
    });
    const chainValues = await this._executor.call({ input }, [this.handlers]);

    // Update AIEmployee Memory
    const memoryUpdateResponse = await this.memory.instruction(`Check if there is any relevant information in this information to add to the database:` + JSON.stringify({ input: agentCall.input, output: agentCall.output }), this.context)
    console.log({ memoryUpdateResponse });
    if (memoryUpdateResponse.updated) {
      this.aiEmployee.memory = this.memory.get();
      await this.aiEmployee.updateOne({ memory: this.aiEmployee.memory });
    }

    await this._afterCall(agentCall, chainValues.output);
    return agentCall;
  }
}
