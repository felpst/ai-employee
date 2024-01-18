import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";
import { pull } from "langchain/hub";
import { ChatOpenAI } from "@langchain/openai";
import type { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatModel } from "@cognum/llm";
import { WebBrowser } from "../utils/web-browser";
import { Calculator } from "langchain/tools/calculator";
import { Skill } from "../browser.interfaces";
import { Schema, z } from "zod";
import {
  DynamicTool,
  DynamicStructuredTool,
} from "@langchain/community/tools/dynamic";
import { SystemMessage } from "langchain/schema";

export class BrowserExecutorAgent {
  private agent: RunnableSequence;
  private agentExecutor: AgentExecutor;

  constructor(
    private webBrowser: WebBrowser,
    private skills: Skill[] = [],
    private memory: String = ''
  ) {}

  async seed() {
    const prompt = await pull<ChatPromptTemplate>(
      "hwchase17/structured-chat-agent"
    );

    const llm = new ChatOpenAI({
      temperature: 0,
      azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
      azureOpenAIApiInstanceName: process.env.AZURE_INSTANCE_NAME,
      azureOpenAIApiVersion: '2023-05-15',
      azureOpenAIApiDeploymentName: 'gpt-4',
    });
    const tools = this.skillsToTools(this.skills);
    console.log(tools);

    // Memory
    prompt.promptMessages.push(new SystemMessage(`Memory: ${this.memory}`));

    this.agent = await createStructuredChatAgent({
      llm,
      tools,
      prompt
    });

    this.agentExecutor = new AgentExecutor({
      // verbose: true,
      agent: this.agent,
      tools,
      returnIntermediateSteps: true,
    });
  }

  async invoke({ input }) {
    if (!this.agent) throw new Error("Agent not seeded");
    const result = await this.agentExecutor.invoke( { input } );
    return result;
  }

  private skillsToTools(skills: Skill[]) {
    const tools = [];

    for (const skill of skills) {
      // Schema
      const props = {};
      for (const prop of Object.keys(skill.inputs)) {
        const input = skill.inputs[prop];
        props[prop] = z[input.type as any]().describe(input.description);
      }

      // Tool
      const webBrowser = this.webBrowser;
      const tool = new DynamicStructuredTool({
        name: skill.name,
        description: skill.description,
        schema: z.object(props),
        func: async (inputs) => {
          let response = 'Done';
          try {
            console.log('inputs', inputs);
            response = await webBrowser.runSteps(skill.steps, inputs);
          } catch (error) { console.error(error); return error.message; }
          return response;
        }
      });
      tools.push(tool);
    }

    return tools;
  }

}
