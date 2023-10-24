import { BaseCallbackHandler } from 'langchain/callbacks';
import { Serialized } from 'langchain/load/serializable';
import { AgentAction, AgentFinish, ChainValues } from 'langchain/schema';

export class LLMCallbackHandler extends BaseCallbackHandler {
  name = 'LLMCallbackHandler';

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
