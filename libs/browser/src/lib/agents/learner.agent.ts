import { ChatModel } from "@cognum/llm";
import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";
import { SystemMessage } from "langchain/schema";
import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { Skill, EveryType, SkillStepMethod } from '../browser.interfaces';
import fs from 'fs';
import SkillVectorDB from '../database/skill-db';

export class BrowserLearnerAgent {
  private _agent: AgentExecutor;

  constructor(
    private _memory: String = '',
  ) {
    this._prompt.promptMessages.push(new SystemMessage(`Memory: ${this._memory}`));
  }

  async seed(): Promise<void> {
    // Tools
    const tools = [new SkillLearningTool()];

    // Agent
    const agent = await createStructuredChatAgent({
      llm: new ChatModel(),
      tools,
      prompt: this._prompt,
    });

    this._agent = new AgentExecutor({
      verbose: true,
      agent,
      tools,
    });

  }

  async invoke({ task, steps }) {
    if (!this._agent)
      throw new Error('Agent not seeded!');

    const input = `Learn skill for task performed.
Task:
${task}

Actions: 
\`\`\`json
${JSON.stringify(steps, null, 2)}
\`\`\``;

    const interfaces = fs
      .readFileSync(__dirname + '/../browser.interfaces.ts')
      .toString();

    return this._agent.invoke({
      input,
      interfaces
    });
  }

  private _prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(`
You are a browser skill learner agent. Your job is to learn skills from action lists provided by the human.
You must consider observation FIRST for getting useful information of each step. If step is successful, learn it.

You should make improvements to the skill flow, such as using loops for repetitive tasks, extracting data for use in future step or using conditions ("if" action).

Your skill should work for BrowserActions class, so take a look in the interfaces:
\`\`\`typescript
{interfaces}
\`\`\`

You have access to the following tools:

{tools}

Use a json blob to specify a tool by providing an action key (tool name) and an action_input key (tool input).

Valid "action" values: "Final Answer" or {tool_names}

Provide only ONE action per $JSON_BLOB, as shown:

\`\`\`
{{
  "action": $TOOL_NAME,
  "action_input": $INPUT
}}
\`\`\`

Follow this format:

Question: input task to do
Thought: consider previous and subsequent steps
Action:
\`\`\`
$JSON_BLOB
\`\`\`
Observation: action result
... (repeat Thought/Action/Observation N times)
Thought: I know what to respond
Action:
\`\`\`
{{
  "action": "Final Answer",
  "action_input": "Final response to human"
}}

Begin! Reminder to ALWAYS respond with a valid json blob of a single action. Use tools if necessary. Respond directly if appropriate. Format is Action:\`\`\`$JSON_BLOB\`\`\`then Observation
`),
    HumanMessagePromptTemplate.fromTemplate(`{input}
{agent_scratchpad}
(reminder to respond in a JSON blob no matter what)`)
  ]);
}

class SkillLearningTool extends DynamicStructuredTool {
  constructor() {
    super({
      name: 'Skill Learning',
      description: 'Use this to learn an skill.',
      schema: z.object({
        name: z.string().describe("skill name."),
        description: z.string().describe("skill description."),
        steps: z.array(z.object({
          method: z.enum(SkillStepMethod).describe('the method to run.'),
          params: z.record(z.string().describe('param name.'), z.any().describe('param value or param name between curly brackets for dinamic params.')),
          successMessage: z.string().optional().describe('success message for step execution.')
        })).describe('sequence of steps until acheive the skill goal.'),
        inputs: z.array(z.record(
          z.string().describe('input key.'), z.object({
            type: z.enum(EveryType).describe('type of the parameter variable.'),
            description: z.string().describe('description of the parameter variable.')
          })
        )).optional().describe('dynamic steps inputs.'),
        successMessage: z.string().optional().describe('success message for skill execution.')
      }),
      func: async (skill: Skill) => {
        try {
          const db = new SkillVectorDB();
          await db.addSkill(skill);

          return `Skill successully learned!`;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
