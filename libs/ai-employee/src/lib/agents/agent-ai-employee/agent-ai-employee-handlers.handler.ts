<<<<<<< HEAD
import { CallProcess } from "@cognum/interfaces";
import { BaseCallbackHandler } from "langchain/callbacks";
import { Serialized } from "langchain/load/serializable";
import { AgentAction, ChainValues, LLMResult } from "langchain/schema";
=======
import { BaseCallbackHandler, NewTokenIndices } from "langchain/callbacks";
import { HandleLLMNewTokenCallbackFields } from "langchain/dist/callbacks/base";
import { Serialized } from "langchain/load/serializable";
import { AgentAction, ChainValues, LLMResult } from "langchain/schema";
import { CallProcess } from "../interfaces/agent.interface";
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe

export class AgentAIEmployeeHandlers extends BaseCallbackHandler {
  name = "AgentAIEmployeeHandler";
  processes: CallProcess[] = [];
  process: CallProcess

<<<<<<< HEAD
  handleChainStart(chain: Serialized, inputs: ChainValues) {
=======
  handleChainStart(chain: Serialized, inputs: ChainValues, runId: string, parentRunId?: string, tags?: string[], metadata?: Record<string, unknown>, runType?: string, name?: string) {
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
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

<<<<<<< HEAD
  handleChainEnd(outputs: ChainValues, runId: string) {
=======
  handleChainEnd(outputs: ChainValues, runId: string, parentRunId?: string, tags?: string[], kwargs?: { inputs?: Record<string, unknown>; }) {
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
    this.process.output = outputs.output;
    this.process.logs.push(['handleChainEnd', runId, outputs]);
  }

  async handleAgentAction(action: AgentAction) {
    this.process.logs.push(['handleAgentAction', action.log]);
  }

<<<<<<< HEAD
  handleLLMStart(llm: Serialized, prompts: string[]) {
    this.process.logs.push(['handleLLMStart', prompts]);
  }

  handleLLMEnd(output: LLMResult) {
    this.process.totalTokenUsage = this.process.totalTokenUsage + output.llmOutput?.estimatedTokenUsage?.totalTokens || 0;
  }

  handleLLMNewToken(token: string) {
    this.process.llmOutput = this.process.llmOutput + token;
    this.process.llmOutputFormatted = this.formatLLMOutput(this.process.llmOutput)
=======
  handleLLMStart(llm: Serialized, prompts: string[], runId: string, parentRunId?: string, extraParams?: Record<string, unknown>, tags?: string[], metadata?: Record<string, unknown>, name?: string) {
    this.process.logs.push(['handleLLMStart', prompts]);
  }

  handleLLMEnd(output: LLMResult, runId: string, parentRunId?: string, tags?: string[]) {
    this.process.totalTokenUsage = this.process.totalTokenUsage + output.llmOutput?.estimatedTokenUsage?.totalTokens || 0;
  }

  handleLLMNewToken(token: string, idx: NewTokenIndices, runId: string, parentRunId?: string, tags?: string[], fields?: HandleLLMNewTokenCallbackFields) {
    this.process.llmOutput = this.process.llmOutput + token;
    this.process.llmOutputFormatted = this.formatLLLOutput(this.process.llmOutput)
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
  }

  async handleText(text: string) {
    this.process.logs.push(['handleText', text]);
  }

<<<<<<< HEAD
  formatLLMOutput(llmOutput: string) {
=======
  formatLLLOutput(llmOutput: string) {
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
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
