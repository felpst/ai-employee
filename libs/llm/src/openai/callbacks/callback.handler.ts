import { OpenAILogsService } from '@cognum/logs';
import { BaseCallbackHandler } from '@langchain/core/callbacks/base';
import { Serialized } from 'langchain/load/serializable';
import { AgentAction, AgentFinish, ChainValues } from 'langchain/schema';


export class LLMCallbackHandler extends BaseCallbackHandler {
  name = 'LLMCallbackHandler';
  private _logsService = new OpenAILogsService();


  async handleLLMStart(
    _llm: Serialized,
    _prompts: string[],
    _runId: string,
    _parentRunId?: string,
    extraParams?: Record<string, unknown>,
    _tags?: string[],
    _metadata?: Record<string, unknown>,
    _name?: string
  ) {
    // this._logsService.log(extraParams)
  }

  async handleChainStart(chain: Serialized) {
    console.log(`Entering new ${chain.id} chain...`);
  }

  async handleChainEnd(_output: ChainValues) {
    console.log('Finished chain.', _output);
  }

  async handleAgentAction(action: AgentAction) {
    console.log(action.log);
  }

  async handleToolEnd(output: string) {
    console.log(output);
  }

  async handleText(text: string) {
    console.log(text);
  }

  async handleAgentEnd(action: AgentFinish) {
    console.log(action.log);
  }

  handleLLMNewToken(token: string) {
    // console.log(token);
  }
}
