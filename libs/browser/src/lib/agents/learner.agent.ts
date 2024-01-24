import { ChatModel } from "@cognum/llm";
import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder, SystemMessagePromptTemplate } from "langchain/prompts";
import { SystemMessage } from "langchain/schema";
import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { Skill, SkillInputType, SkillStepMethod } from '../browser.interfaces';
import { writeFileSync } from 'fs';

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
      // verbose: true,
      agent,
      tools,
      returnIntermediateSteps: true,
    });

  }

  async invoke({ input }) {
    if (!this._agent)
      throw new Error('Agent not seeded!');

    const result = await this._agent.invoke({
      input,
    }, {
      callbacks: [
        {
          handleLLMEnd(output) {
            const [[generated]] = output.generations;
            console.log('agent output', { output: generated.text });
          },
          handleToolError(error) {
            console.error('tool error', error);
          },
          awaitHandlers: true
        }
      ]
    });
    return result;
  }

  private _prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(`
You are a browser skill learner agent. Your job is to learn skills from action lists provided by the human.
You must consider observation FIRST for getting useful information of each step. If step is successful, learn it.

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
            type: z.enum(SkillInputType).describe('type of the parameter variable.'),
            description: z.string().describe('description of the parameter variable.')
          })
        )).describe('dynamic steps inputs.'),
        successMessage: z.string().optional().describe('success message for skill execution.')
      }),
      func: async (skill: Skill) => {
        try {
          writeFileSync('skill.json', JSON.stringify(skill));
          return `Skill successully learned!`;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
