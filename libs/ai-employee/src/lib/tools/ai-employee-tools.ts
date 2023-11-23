import { KnowledgeRetrieverTool, MailSenderTool, PythonTool, SQLTool } from "@cognum/tools";
import { DynamicStructuredTool, SerpAPI, Tool } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { z } from "zod";

export class AIEmployeeTools {
  private readonly workspaceId: string;

  constructor(workspaceId: string) {
    this.workspaceId = workspaceId;
  }

  get(toolsIds: string[] = []) {
    const tools: Tool[] = [];

    for (const id of toolsIds) {
      tools.push(this.tools[id]);
    }

    return tools;
  }

  private get tools() {
    return {
      'serp-api': new SerpAPI(),
      calculator: new Calculator(),
      'random-number-generator': new DynamicStructuredTool({
        name: "random-number-generator",
        description: "generates a random number between two input numbers",
        schema: z.object({
          low: z.number().describe("The lower bound of the generated number"),
          high: z.number().describe("The upper bound of the generated number"),
        }),
        func: async ({ low, high }) =>
          (Math.random() * (high - low) + low).toString(), // Outputs still must be strings
        returnDirect: false, // This is an option that allows the tool to return the output directly
      }),
      'mail-sender': new MailSenderTool({
        service: "gmail",
        user: "ta.funcionando15@gmail.com",
        password: "ibzu qzah ihzz sdcg",
      }),
      'knowledge-retriever': new KnowledgeRetrieverTool(this.workspaceId),
      'python': new PythonTool(),
      'sql': new SQLTool(
        "postgresql",
        "renato",
        "password",
        "postgres",
        "5432",
        "Chinook"
      ),
    };
  }
}
