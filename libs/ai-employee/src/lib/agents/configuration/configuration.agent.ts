import { IAIEmployee, IAgentCall } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { INTENTIONS } from "../../utils/intent-classifier/intent-classifier.util";
import { Agent } from "../agent";

export class ConfigurationAgent extends Agent {

  constructor(public aiEmployee: IAIEmployee) {
    super(aiEmployee);
    this.agent = INTENTIONS.CONFIGURATION_OR_CUSTOMIZATION
  }

  async call(input: string, intent: string): Promise<IAgentCall> {
    const agentCall = await this._initCall(input, intent);

    // Update AIEmployee Memory
    const memoryUpdateResponse = await this.aiEmployee.memoryInstruction(input, this.context)
    console.log('memoryUpdateResponse', JSON.stringify(memoryUpdateResponse));

    // TODO add tools to settings
    const model = new ChatModel();
    this._executor = await initializeAgentExecutorWithOptions([], model, {
      agentType: "chat-conversational-react-description",
      agentArgs: {
        systemMessage: `Your name is ${this.aiEmployee.name} and your role is ${this.aiEmployee.role}.`
      }
    });
    const chainValues = await this._executor.call({ input }, [this.handlers]);

    await this._afterCall(agentCall, chainValues.output);
    return agentCall;
  }
}
