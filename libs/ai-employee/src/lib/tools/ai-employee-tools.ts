<<<<<<< HEAD
import { IToolSettings } from "@cognum/interfaces";
import { MailSenderTool, RandomNumberTool } from "@cognum/tools";
import { DynamicStructuredTool, SerpAPI, Tool } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";

export class AIEmployeeTools {

  static get(toolsSettings: IToolSettings[] = []): Tool[] {
    const tools: Tool[] = [];
    for (const toolSettings of toolsSettings) {
      const tool = AIEmployeeTools.initTool(toolSettings) as Tool
      if (tool) tools.push(tool);
    }
    return tools
  }

  static initTool(toolSettings: IToolSettings): Tool | DynamicStructuredTool {
    switch (toolSettings.id) {
      case 'calculator':
        return new Calculator();
      case 'web-search':
        // eslint-disable-next-line no-case-declarations
        const tool = new SerpAPI();
        tool.metadata = {
          id: 'web-search',
        }
        return tool;
      case 'random-number':
        return new RandomNumberTool();
      case 'mail-sender':
        return new MailSenderTool(toolSettings.options);
=======
import { MailSenderTool, PythonTool, SQLTool } from "@cognum/tools";
import { DynamicStructuredTool, SerpAPI, Tool } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { z } from "zod";

export class AIEmployeeTools {

  static get(toolsIds: string[] = []) {
    const tools: Tool[] = [];

    for (const id of toolsIds) {
      tools.push(AIEmployeeTools.tools[id])
    }

    return tools
  }

  private static get tools() {
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
        user: process.env.EMAIL_USER || "ta.funcionando15@gmail.com",
        password: process.env.EMAIL_PASSWORD || "ibzu qzah ihzz sdcg",
      }),
      'python': new PythonTool(),
      'sql': new SQLTool(
        "postgresql",
        "renato",
        "password",
        "postgres",
        "5432",
        "Chinook"
      ),
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
    }
  }

}
