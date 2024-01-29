import { CallProcess } from "@cognum/interfaces";
import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import { Serialized } from "langchain/load/serializable";
import { AgentAction, AgentFinish, ChainValues, LLMResult } from "langchain/schema";

export class AgentAIEmployeeHandlers extends BaseCallbackHandler {
  name = "AgentAIEmployeeHandler";
  processes: CallProcess[] = [];
  process: CallProcess;

  handleChainStart(chain: Serialized, inputs: ChainValues) {
    this.process = {
      input: inputs.input,
      output: '',
      llmOutput: '',
      llmOutputFormatted: '',
      logs: [],
      totalTokenUsage: 0,
    };
    this.processes.push(this.process);
  }

  handleChainEnd(outputs: ChainValues, runId: string) {
    this.process.output = outputs.output;
    this.process.logs.push(['handleChainEnd', runId, outputs]);
  }

  handleAgentAction(action: AgentAction, runId: string, parentRunId?: string, tags?: string[]): void | Promise<void> {

  }

  handleToolStart(tool: Serialized, input: string, runId: string, parentRunId?: string, tags?: string[], metadata?: Record<string, unknown>, name?: string) {

  }

  handleToolEnd(output: string, runId: string, parentRunId?: string, tags?: string[]) {

  }

  handleToolError(err: any, runId: string, parentRunId?: string, tags?: string[]) {

  }

  handleAgentEnd(action: AgentFinish, runId: string, parentRunId?: string, tags?: string[]): void | Promise<void> {

  }

  handleLLMStart(llm: Serialized, prompts: string[]) {
    this.process.logs.push(['handleLLMStart', prompts]);
  }

  handleLLMEnd(output: LLMResult) {
    this.process.totalTokenUsage = this.process.totalTokenUsage + output.llmOutput?.estimatedTokenUsage?.totalTokens || 0;
  }

  handleLLMNewToken(token: string) {
    this.process.llmOutput = this.process.llmOutput + token;
    this.process.llmOutputFormatted = this.formatLLMOutput(this.process.llmOutput);
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
