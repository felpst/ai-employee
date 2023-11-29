import { CallProcess } from "@cognum/interfaces";
import { BaseCallbackHandler } from "langchain/callbacks";
import { Serialized } from "langchain/load/serializable";
import { AgentAction, ChainValues, LLMResult } from "langchain/schema";

export class AgentAIEmployeeHandlers extends BaseCallbackHandler {
  name = "AgentAIEmployeeHandler";
  processes: CallProcess[] = [];
  process: CallProcess

  handleChainStart(chain: Serialized, inputs: ChainValues) {
    this.process = {
      input: inputs.input,
      output: '',
      llmOutput: '',
      llmOutputFormatted: '',
      logs: [],
      totalTokenUsage: 0,
    }
    this.processes.push(this.process);
  }

  handleChainEnd(outputs: ChainValues, runId: string) {
    this.process.output = outputs.output;
    this.process.logs.push(['handleChainEnd', runId, outputs]);
  }

  async handleAgentAction(action: AgentAction) {
    this.process.logs.push(['handleAgentAction', action.log]);
  }

  handleLLMStart(llm: Serialized, prompts: string[]) {
    this.process.logs.push(['handleLLMStart', prompts]);
  }

  handleLLMEnd(output: LLMResult) {
    this.process.totalTokenUsage = this.process.totalTokenUsage + output.llmOutput?.estimatedTokenUsage?.totalTokens || 0;
  }

  handleLLMNewToken(token: string) {
    this.process.llmOutput = this.process.llmOutput + token;
    this.process.llmOutputFormatted = this.formatLLMOutput(this.process.llmOutput)
  }

  async handleText(text: string) {
    this.process.logs.push(['handleText', text]);
  }

  formatLLMOutput(llmOutput: string) {
    if (llmOutput) {
      // Remove os caracteres extras no início da string
      const cleanedInput = llmOutput.replace(/```json\n'\s*\+/, '');

      // Tenta encontrar e extrair a informação relevante usando expressões regulares
      let matches = cleanedInput.match(/"action":\s*"Final Answer",\s*"action_input":\s*"([^"]*)"/);
      if (matches && matches.length > 1) {
        const actionInput = matches[1].replace(/\\n/g, '\n');
        return actionInput; // Retorna o valor capturado de action_input
      }

      // Tenta encontrar e extrair a informação relevante usando expressões regulares
      matches = cleanedInput.match(/"action":\s*"Final Answer",\s*"action_input":\s*"([^"]*)$/);
      if (matches && matches.length > 1) {
        const actionInput = matches[1].replace(/\\n/g, '\n');
        return actionInput; // Retorna o valor capturado de action_input
      }

      return ""; // Retorna string vazia se o padrão não for encontrado
    }
  }
}
