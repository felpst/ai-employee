import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

export class RandomNumberTool extends DynamicStructuredTool {

  constructor() {
    super({
      name: "Random Number Tool",
      metadata: {
        id: "random-number"
      },
      description: "generates a random number between two input numbers",
      schema: z.object({
        low: z.number().describe("The lower bound of the generated number"),
        high: z.number().describe("The upper bound of the generated number"),
      }),
      func: async ({ low, high }) =>
        (Math.random() * (high - low) + low).toString(), // Outputs still must be strings
      returnDirect: false, // This is an option that allows the tool to return the output directly
    });
  }
}
