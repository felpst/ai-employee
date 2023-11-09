import { IMessage, IUser } from '@cognum/interfaces';
import { AgentActionOutputParser } from 'langchain/agents';
import {
  BaseChatPromptTemplate,
  SerializedBasePromptTemplate,
  renderTemplate
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
import { ToolsHelper } from '../../../../tools/src/lib/helpers/tools.helper';
import { Profile } from '../interfaces';

const formatIdentity = (profile: Profile) =>
  `Your name is ${profile.name || 'Atlas'}. Your a ${
    profile.role || 'Assistant'
  }.`;

const formatPrefix = (user: IUser) =>
  `You are talking to ${user?.name || ''}
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

export class AIEmployeePromptTemplate extends BaseChatPromptTemplate {
  tools: Tool[];
  _toolsHelper: ToolsHelper;
  profile: Profile = {
    name: 'Atlas',
    role: 'Assistant',
  };
  // private _memory: AIEmployeeMemory;
  user: IUser;

  constructor(args: {
    tools: Tool[];
    inputVariables: string[];
    profile: Profile;
    // memory: AIEmployeeMemory;
    // user: IUser;
  }) {
    super({ inputVariables: args.inputVariables });
    this.tools = args.tools;
    this._toolsHelper = new ToolsHelper(this.tools);
    this.profile = args.profile;
    // this._memory = args.memory;
    // this.user = args.user;
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
    const profile = formatIdentity(this.profile);

    const prefix = formatPrefix(this.user);

    // Instructions
    const instructions = formatInstructions(toolNames);

    // Summary
    const summary = '';
    const suffix = formatSuffix(summary, []);

    // Template
    const template = [profile, prefix, toolStrings, instructions, suffix].join(
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  partial(_values: PartialValues): Promise<any> {
    throw new Error('Not implemented');
  }

  serialize(): SerializedBasePromptTemplate {
    throw new Error('Not implemented');
  }
}

export class AIEmployeeOutputParser extends AgentActionOutputParser {
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
