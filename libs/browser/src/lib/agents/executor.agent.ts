import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";
import { pull } from "langchain/hub";
import { ChatOpenAI } from "@langchain/openai";
import type { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatModel } from "@cognum/llm";
import { WebBrowser } from "../utils/web-browser";
import { Calculator } from "langchain/tools/calculator";

export class BrowserExecutorAgent {
  private agent: RunnableSequence;
  private agentExecutor: AgentExecutor;

  constructor(
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
    const tools = [
      new Calculator(),
    ]

    this.agent = await createStructuredChatAgent({
      llm,
      tools,
      prompt,
    });

    this.agentExecutor = new AgentExecutor({
      agent: this.agent,
      tools,
    });
  }

  async invoke({ input }) {
    console.log('A', input);

    if (!this.agent) throw new Error("Agent not seeded");
    console.log('B');
    const result = await this.agentExecutor.invoke( { input } );
    console.log(result);
    return result;
  }

}
