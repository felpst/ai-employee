import { IAIEmployee } from '@cognum/interfaces';
import { AgentExecutor, StructuredChatOutputParserWithRetries } from 'langchain/agents';
import { formatLogToString } from "langchain/agents/format_scratchpad/log";
import { Callbacks } from 'langchain/callbacks';
import { AgentStep } from 'langchain/schema';
import { RunnableSequence } from 'langchain/schema/runnable';
import { AIEmployeeModelHelper } from '../helpers/ai-employee-model.helper';
import { AgentPrompt } from '../modules';
import { AIEmployeeTools } from '../tools/ai-employee-tools';

export class AIEmployeeAgent {
  private _executor: AgentExecutor;

  constructor(
    private aiEmployee: IAIEmployee,
    private callbacks: Callbacks = []
  ) { }

  async init() {
    const agentPrompt = new AgentPrompt(this.aiEmployee);
    const prompt = await agentPrompt.format();

    const tools = AIEmployeeTools.get();
    const toolNames = tools.map((tool) => tool.name);

    const outputParser = StructuredChatOutputParserWithRetries.fromLLM(
      AIEmployeeModelHelper.chatModel(),
      { toolNames }
    );

    const model = AIEmployeeModelHelper.chatModel({
      verbose: true,
      stop: ['\nObservation'],
      callbacks: this.callbacks,
    });

    const runnableAgent = RunnableSequence.from([
      {
        input: (i: { input: string; steps: AgentStep[] }) => i.input,
        agent_scratchpad: (i: { input: string; steps: AgentStep[] }) =>
          formatLogToString(i.steps),
      },
      prompt,
      model,
      outputParser
    ]);

    this._executor = AgentExecutor.fromAgentAndTools({
      agent: runnableAgent,
      tools,
    });
    console.log('Loaded agent.');
    return this;
  }

  async call(input: string, callbacks?: unknown[]) {
    const chainValues = await this._executor.call({ input }, [...callbacks, ...this.callbacks as unknown[]]);
    const response = chainValues.output;
    return response;
  }

}
