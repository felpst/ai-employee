import { IAgent, IAgentCall, IAIEmployee } from "@cognum/interfaces";
import { Agent } from "./agents/agent";
import { ConfigurationAgent } from "./agents/configuration";
import { GeneralAgent } from "./agents/general";
import { InformationRetrievalAgent } from "./agents/information-retrieval";
import { TaskExecutionAgent } from "./agents/task-execution";
import { intentClassifier, INTENTIONS } from "./utils/intent-classifier/intent-classifier.util";

export class AIEmployee extends Agent {
  constructor(public aiEmployee: IAIEmployee) {
    super(aiEmployee);
    this.agent = 'AIEmployee'
  }

  async call(input: string): Promise<IAgentCall> {
    const intentClassifierResult = await intentClassifier(input);
    console.log(intentClassifierResult);

    // TODO Planning action
    // TODO While to check if the input is atteded

    // Agent
    let agent: IAgent;
    let agentCall: IAgentCall;
    switch (intentClassifierResult.intention) {
      case INTENTIONS.INFORMATION_RETRIEVAL:
        agent = await new InformationRetrievalAgent(this.aiEmployee).init()
        agentCall = await agent.call(input, intentClassifierResult.intention)
        break;
      case INTENTIONS.TASK_EXECUTION:
        agent = await new TaskExecutionAgent(this.aiEmployee).init()
        agentCall = await agent.call(input, intentClassifierResult.intention)
        break;
      case INTENTIONS.CONFIGURATION_OR_CUSTOMIZATION:
        agent = await new ConfigurationAgent(this.aiEmployee).init()
        agentCall = await agent.call(input, intentClassifierResult.intention)
        break;
      default:
        agent = await new GeneralAgent(this.aiEmployee).init()
        agentCall = await agent.call(input, intentClassifierResult.intention)
        break;
    }

    // TODO Check answer accuracy || generate final answer

    return agentCall;
  }


}
