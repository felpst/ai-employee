import { IAIEmployeeMemory, IMemorySearchResult } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";
import { z } from "zod";

export async function memorySearch(memory: IAIEmployeeMemory[], question: string, context: string[] = []): Promise<IMemorySearchResult> {
  if (!memory) {
    return {
      answer: "I don't know.",
      accuracy: false,
    }
  };

  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      answer: z.string().describe("the answer of the question."),
      accuracy: z.boolean().describe("the accuracy of the answer.")
    })
  );

  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(
      `Task: Analyze the question and create a excelent answer usign only data below:
      \`\`\`json
      {memory}
      \`\`\`
      ---
      {format_instructions}
      {context}
      User Question: {question}`
    ),
    new ChatModel(),
    parser,
  ]);

  const response = await chain.invoke({
    memory: JSON.stringify(memory || []),
    context: context ? `User Context: ${JSON.stringify(context || [])}` : '',
    question,
    format_instructions: parser.getFormatInstructions(),
  });

  // console.log(response);
  return response;
}
