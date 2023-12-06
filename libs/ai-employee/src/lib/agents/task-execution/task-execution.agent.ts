import { IAIEmployee, IAIEmployeeCall } from "@cognum/interfaces";
import { BehaviorSubject } from "rxjs";
import { AgentTools } from "../agent-tools/agent-tools.agent";

export interface ITaskExecutionAgentOptions {
  $call: BehaviorSubject<IAIEmployeeCall>;
  input: string;
  context?: any;
  aiEmployee: IAIEmployee;
  intentions: string[]
}

export interface ICallOutput {
  text: string;
  accuracy: boolean;
}

export class TaskExecutionAgent {

  async call(options: ITaskExecutionAgentOptions): Promise<ICallOutput> {
    const { $call, input, context, aiEmployee, intentions } = options;
    const agentTools = new AgentTools()
    const output = await agentTools.call(options);
    if (output === 'NOT_POSSIBLE_TO_EXECUTE_THIS_ACTION') {
      return { text: "I don't know", accuracy: false }
    }
    const accuracy = await aiEmployee.checkValidAnswer(input, output)
    return { text: output, accuracy }
  }


  // async updateMemory(input: string, output: string) {
  //   // Update AIEmployee Memory
  //   const instruction = `Check if there is any relevant information in this information to add to the database:` + JSON.stringify({ input, output })

  //   const memoryInstructionResult = await this.aiEmployee.memoryInstruction(instruction, this.context)
  //   console.log('memoryInstructionResult', JSON.stringify(memoryInstructionResult));
  // }
}
