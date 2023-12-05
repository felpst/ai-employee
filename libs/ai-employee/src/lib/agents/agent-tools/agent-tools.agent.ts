import { IAIEmployee, IAIEmployeeCall, IAIEmployeeCallStep } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { AgentExecutor, initializeAgentExecutorWithOptions } from "langchain/agents";
import { Serialized } from "langchain/load/serializable";
import { BufferMemory } from "langchain/memory";
import { MessagesPlaceholder } from "langchain/prompts";
import { ChainValues } from "langchain/schema";
import { BehaviorSubject } from "rxjs";
import { AIEmployeeTools } from "../../tools/ai-employee-tools";

export interface IAgentToolsOptions {
  $call: BehaviorSubject<IAIEmployeeCall>;
  input: string;
  context?: any;
  aiEmployee: IAIEmployee;
  intentions: string[]
}
export class AgentTools {
  private _executor: AgentExecutor;

  async init(options: IAgentToolsOptions) {
    const { aiEmployee, intentions } = options;
    const model = new ChatModel();

    const intetionTools = AIEmployeeTools.intetionTools({
      aiEmployee,
      intentions
    });

    this._executor = await initializeAgentExecutorWithOptions(intetionTools, model, {
      agentType: "structured-chat-zero-shot-react-description",
      // verbose: true,
      memory: new BufferMemory({
        memoryKey: "chat_history",
        returnMessages: true,
      }),
      agentArgs: {
        suffix: "IMPORTANT: If you don't have a tool to execute the job, your final answer must to be: 'NOT_POSSIBLE_TO_EXECUTE_THIS_ACTION'. Ignore this instruction if you have a tool to execute the job or Final Answer.",
        inputVariables: ["input", "agent_scratchpad", "chat_history"],
        memoryPrompts: [new MessagesPlaceholder("chat_history")],
      },
    });

    return this;
  }

  async call(options: IAgentToolsOptions): Promise<string> {
    const { $call, input, context, aiEmployee, intentions } = options;
    const call = options.$call.value;

    await this.init(options);

    let step: IAIEmployeeCallStep;
    let stepIndex: number;
    const callbacks = [{
      handleChainStart: async (chain: Serialized, inputs: ChainValues) => {
        if (inputs.agent_scratchpad === undefined) return;
        console.log('handleChainStart')
        // Analisar o contexto e definir próxima ação
        step = {
          type: 'action',
          description: 'Analyze the context and define the next action',
          inputs: {
            text: inputs.input
          },
          outputs: {},
          tokenUsage: 0,
          status: 'running',
          startAt: new Date(),
          endAt: null
        }
        stepIndex = call.steps.push(step);
        await call.save()
        $call.next(call)
      },
      // handleLLMStart: (llm: Serialized, prompts: string[]) => {
      //   console.log('handleLLMStart');
      // },
      // handleLLMEnd: (output: LLMResult) => {
      //   console.log('handleLLMEnd');
      // },
      handleChainEnd: async (outputs: ChainValues, runId: string) => {
        console.log('handleChainEnd')
        // Definiu a próxima ação, seja uma resposta final ou a execução de uma ferramenta
        // TODO token usage
        step.outputs = {
          text: outputs.output || null
        };
        step.status = 'done';
        step.endAt = new Date();

        // Update call
        call.steps[stepIndex - 1] = step
        await call.save()
        $call.next(call)
      },
      // handleAgentAction(action: AgentAction, runId: string, parentRunId?: string, tags?: string[]): void | Promise<void> {
      //   // Escolheu a ferramenta para execução
      // },
      handleToolStart: async (tool: Serialized, input: string, runId: string, parentRunId?: string, tags?: string[], metadata?: Record<string, unknown>, name?: string) => {
        console.log('handleToolStart')
        // Iniciou a execução da ferramenta
        // Analisar o contexto e definir próxima ação
        step = {
          type: 'action',
          description: 'Tool execution',
          inputs: {
            tool: metadata.id
          },
          outputs: {},
          tokenUsage: 0,
          status: 'running',
          startAt: new Date(),
          endAt: null
        }
        stepIndex = call.steps.push(step);
        await call.save()
        $call.next(call)
      },
      handleToolEnd: async (output: string, runId: string, parentRunId?: string, tags?: string[]) => {
        console.log('handleToolEnd')
        // Finalizou a execução da ferramenta
        // TODO token usage
        step.outputs = {
          text: output
        };
        step.status = 'done';
        step.endAt = new Date();

        // Update call
        call.steps[stepIndex - 1] = step
        await call.save()
        $call.next(call)
      },
    }]

    try {
      const chainValues = await this._executor.call({ input }, callbacks);
      const response = chainValues.output;
      return response;
    } catch (error) {
      console.error('[AgentTools Call]', error.message)
      return error.message;
    }
  }

}
