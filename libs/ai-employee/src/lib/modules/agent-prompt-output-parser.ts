import { AgentActionOutputParser } from "langchain/agents";
import { AgentAction, AgentFinish } from "langchain/schema";

export class AgentPromptOutputParser extends AgentActionOutputParser {
  lc_namespace = ['langchain', 'agents', 'custom_llm_agent_chat'];
  lastThought: string;

  async parse(text: string): Promise<AgentAction | AgentFinish> {
    if (text.includes('Final Answer:')) {
      const parts = text.split('Final Answer:');
      const input = parts[parts.length - 1].trim();
      const finalAnswers = { output: input };
      this.lastThought = parts[0] ? parts[0].replace(/\n/g, '').trim() : '';

      return { log: text, returnValues: finalAnswers };
    }

    const match = /Action: (.*)\nAction Input: (.*)/s.exec(text);
    if (!match) {
      throw new Error(`Could not parse LLM output: ${text}`);
    }

    return {
      tool: match[1].trim(),
      toolInput: match[2].trim().replace(/^"+|"+$/g, ''),
      log: text,
    };
  }

  getLastThought(): string {
    return this.lastThought;
  }

  getFormatInstructions(): string {
    throw new Error('Not implemented');
  }
}
