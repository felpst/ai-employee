import { IAIEmployee, IAgentCall } from "@cognum/interfaces";
import { INTENTIONS } from "../../utils/intent-classifier/intent-classifier.util";
import { Agent } from "../agent";
import { AgentTools } from "../agent-tools/agent-tools.agent";

export class TaskExecutionAgent extends Agent {

  constructor(public aiEmployee: IAIEmployee) {
    super(aiEmployee);
    this.agent = INTENTIONS.TASK_EXECUTION
  }

  async call(instruction: string, intent: string): Promise<IAgentCall> {
    const agentCall = await this._initCall(instruction, intent);

    // Agent tools
    const agentTools = await new AgentTools(this.aiEmployee, [INTENTIONS.TASK_EXECUTION]).init();
    const output = await agentTools.call(instruction);

    // Salvar Resposta
    await this.updateMemory(instruction, output)

    await this._afterCall(agentCall, output);

    // Retornar a resposta
    return agentCall;
  }

  async updateMemory(input: string, output: string) {
    // Update AIEmployee Memory
    const instruction = `Check if there is any relevant information in this information to add to the database:` + JSON.stringify({ input, output })
    const memoryUpdateResponse = await this.memory.instruction(instruction, this.context)
    console.log('memoryUpdateResponse', JSON.stringify(memoryUpdateResponse));
    if (memoryUpdateResponse.updated) {
      this.aiEmployee.memory = this.memory.get();
      await this.aiEmployee.updateOne({ memory: this.aiEmployee.memory });
    }
  }
}
