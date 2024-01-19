import { ChatModel } from "@cognum/llm";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";

export async function aiEmployeeCheckValidAnswer(input: string, answer: string): Promise<boolean> {
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      isValid: z.boolean().describe("Check is valid answer. Must be false when a question is not answered or an action could not be performed."),
    })
  );

  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(
      `Task: Analyze the user input and check whether the answer is perfect to meet the request.
      User input: {input}
      Answer: {answer}
      ---
      {format_instructions}`
    ),
    new ChatModel(),
    parser,
  ]);

  const response = await chain.invoke({
    input, answer,
    format_instructions: parser.getFormatInstructions(),
  });

  return response.isValid;
}
