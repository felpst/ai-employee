import { MailSenderTool } from "@cognum/tools";
import { DynamicStructuredTool, Tool } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { z } from "zod";

export class AIEmployeeTools {

  static get(toolsIds: string[]) {
    const tools: Tool[] = [];

    for (const id of toolsIds) {
      tools.push(AIEmployeeTools.tools[id])
    }

    return tools
  }

  private static get tools() {
    return {
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
      })
    }
  }

}
