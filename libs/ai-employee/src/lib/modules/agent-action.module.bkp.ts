import { IAIEmployee } from "@cognum/interfaces";
import { Tool } from "langchain/tools";
import { AIEmployeeTools } from "../tools/ai-employee-tools";

export class AgentModuleAction {
  name: string;
  tools: Tool[];

  constructor(
    private aiEmployee: IAIEmployee
  ) {
    this.tools = AIEmployeeTools.get(this.aiEmployee.tools);
  }

  async prompt() {
    const chatConversation = await this._chatConversation(this.tools);
    const instructions = await this._instructions();
    const start = await this._start();

    const template = [chatConversation, instructions, start].join('\n');
    return template;
  }

  private async _chatConversation(tools: Tool[] = []) {
    const toolStrings = tools
      .map((tool) => `${tool.name}: ${tool.description}`)
      .join('\n');

    return `You are talking to human.
    The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context.
    You can get informations in summary or history conversation without tools or use tools to get new informations.
    Answer the following questions as best you can. You have access to the following tools:
    ${toolStrings}`
  }

  private async _instructions(tools: Tool[] = []) {
    const toolNames = tools.map((tool) => tool.name).join(',');

    return `Use the following format in your response:

    Question: the input question you must answer
    Thought: you should always think about what to do
    Action: the action to take, should be one of [${toolNames}]
    Action Input: the input to the action
    Observation: the result of the action
    ... (this Thought/Action/Action Input/Observation can repeat N times)
    Thought: I now know the final answer
    Final Answer: the final answer to the original input question`
  }

  private async _start() {
    return `Begin!
    Question: {input}
    Thought: {agent_scratchpad}`
  }
}
