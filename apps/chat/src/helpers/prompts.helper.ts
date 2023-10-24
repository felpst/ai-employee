import { ICompany, IMessage, IUser } from '@cognum/interfaces';
import { AgentActionOutputParser } from 'langchain/agents';
import { ChatPromptValue } from 'langchain/dist/prompts/chat';
import {
  BaseChatPromptTemplate,
  BasePromptTemplate,
  SerializedBasePromptTemplate,
  renderTemplate,
} from 'langchain/prompts';
import {
  AgentAction,
  AgentFinish,
  AgentStep,
  BaseMessage,
  HumanMessage,
  InputValues,
  PartialValues,
} from 'langchain/schema';
import { Tool } from 'langchain/tools';
import { AIEmployeeMemory } from '../memories/ai_employee.memory';
import { ToolsHelper } from './tools.helper';

const formatIdentity = (identity: AIEmployeeIdentity) =>
  `Your name is ${identity.name || 'Atlas'}. Your a ${
    identity.profession || 'Assistant'
  }.`;

const formatPrefix = (user: IUser, company: ICompany) =>
  `You are talking to "${user?.name || ''}", and you work at company "${
    company?.name || ''
  }".
The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context.
You can get informations in summary or history conversation without tools or use tools to get new informations.
Answer the following questions as best you can. You have access to the following tools:`;

const formatInstructions = (
  toolNames: string
) => `Use the following format in your response:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [${toolNames}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question`;

const formatSuffix = (summary: string, messages: IMessage[]) => `Begin!

${summary ? `\nConversation Summary: ${summary}` : ''}

Conversation History:
${messages.length > 10 ? '(old messages...)\n' : ''}${messages
  .slice(-10)
  .map((message) => `> ${message.role}: ${message.content}`)
  .join('\n')}

Question: {input}
Thought:{agent_scratchpad}`;

export interface AIEmployeeIdentity {
  name: string;
  profession: string;
}

export class AIEmployeePromptTemplate extends BaseChatPromptTemplate {
  tools: Tool[];
  _toolsHelper: ToolsHelper;
  identity: AIEmployeeIdentity = {
    name: 'Atlas',
    profession: 'Assistant',
  };
  private _memory: AIEmployeeMemory;
  user: IUser;
  company: ICompany;

  constructor(args: {
    tools: Tool[];
    inputVariables: string[];
    identity: AIEmployeeIdentity;
    memory: AIEmployeeMemory;
    user: IUser;
    company: ICompany;
  }) {
    super({ inputVariables: args.inputVariables });
    this.tools = args.tools;
    this._toolsHelper = new ToolsHelper(this.tools);
    this.identity = args.identity;
    this._memory = args.memory;
    this.user = args.user;
    this.company = args.company;
  }

  _getPromptType(): string {
    return 'chat';
  }

  async formatMessages(values: InputValues): Promise<BaseMessage[]> {
    /** Construct the final template */

    // Tools
    const tools = await this._toolsHelper.getTools(values.input);
    // console.log('Tools', tools.map(tool => tool.name).join(', '));
    const toolStrings = tools
      .map((tool) => `${tool.name}: ${tool.description}`)
      .join('\n');
    const toolNames = this.tools.map((tool) => tool.name).join('\n');

    // Identity
    const identity = formatIdentity(this.identity);

    const prefix = formatPrefix(this.user, this.company);

    // Instructions
    const instructions = formatInstructions(toolNames);

    // Summary
    const summary = this._memory.chat.summary || '';
    const suffix = formatSuffix(summary, this._memory.getLastMessages());

    // Template
    const template = [identity, prefix, toolStrings, instructions, suffix].join(
      '\n\n'
    );

    /** Construct the agent_scratchpad */
    const intermediateSteps = values.intermediate_steps as AgentStep[];
    const agentScratchpad = intermediateSteps.reduce(
      (thoughts, { action, observation }) =>
        thoughts +
        [action.log, `\nObservation: ${observation}`, 'Thought:'].join('\n'),
      ''
    );
    const newInput = { agent_scratchpad: agentScratchpad, ...values };
    /** Format the template. */
    const formatted = renderTemplate(template, 'f-string', newInput);
    // console.log(formatted);

    return [new HumanMessage(formatted)];
  }

  // partial(_values: PartialValues): Promise<BasePromptTemplate> {
  //   throw new Error('Not implemented');
  // }

  partial(
    values: PartialValues
  ): Promise<BasePromptTemplate<any, ChatPromptValue, any>> {
    throw new Error('Method not implemented.');
  }

  serialize(): SerializedBasePromptTemplate {
    throw new Error('Not implemented');
  }
}

export class AIEmployeeOutputParser extends AgentActionOutputParser {
  lc_namespace = ['langchain', 'agents', 'custom_llm_agent_chat'];

  async parse(text: string): Promise<AgentAction | AgentFinish> {
    if (text.includes('Final Answer:')) {
      const parts = text.split('Final Answer:');
      const input = parts[parts.length - 1].trim();
      const finalAnswers = { output: input };
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

  getFormatInstructions(): string {
    throw new Error('Not implemented');
  }
}
