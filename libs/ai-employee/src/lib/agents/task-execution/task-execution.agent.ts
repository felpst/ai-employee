import { IAIEmployee, IAIEmployeeCall, IAIEmployeeCallStep, IMemoryInstructionResult } from "@cognum/interfaces";
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
    if (accuracy) {
      await this.updateMemory(options, output);

    }
    return { text: output, accuracy }
  }

  async updateMemory(options: ITaskExecutionAgentOptions, output: string): Promise<IMemoryInstructionResult> {
    const { $call, input, context, aiEmployee } = options;

    const call = options.$call.value;
    const step: IAIEmployeeCallStep = {
      type: 'action',
      description: 'Update Memory',
      inputs: {
        input,
        output
      },
      outputs: {},
      tokenUsage: 0,
      status: 'running',
      startAt: new Date(),
      endAt: null
    }
    const index = call.steps.push(step);
    await call.save()
    $call.next(call)

    // Update AIEmployee Memory
    const instruction = `Check if there is any relevant information in this information to add to the database:` + JSON.stringify({ input, output })
    const memoryInstructionResult = await aiEmployee.memoryInstruction(instruction, context)
    console.log('memoryInstructionResult', JSON.stringify(memoryInstructionResult));

    // TODO token usage
    step.outputs = {
      text: output,
      memoryInstructionResult
    };
    step.status = 'done';
    step.endAt = new Date();

    // Update call
    call.steps[index - 1] = step
    await call.save()
    $call.next(call)

    return memoryInstructionResult;
  }
}
