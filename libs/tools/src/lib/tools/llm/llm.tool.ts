import { ChatModel } from "@cognum/llm";
import { DynamicTool } from "@langchain/core/tools";

export class LlmTool extends DynamicTool {
  constructor() {
    super({
      name: "Llm",
      metadata: {
        id: "llm"
      },
      description:
        "Use to answer questions. The input must be a question to be answered",
      func: async (input: string) => {
        try {
          const model = new ChatModel();
          const result = await model.invoke(input);
          console.log("result: ", result);
          return result.content;
        } catch (error) {
          return error.message;
        }
      }
    });
  }
}
