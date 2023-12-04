import { IAIEmployeeMemory, IMemoryInstructionResult } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";
import { z } from "zod";

export async function memoryInstruction(memory: IAIEmployeeMemory[] = [], instruction: string, context: string[] = []): Promise<IMemoryInstructionResult> {
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      database: z.array(
        z.object({
          pageContent: z.string().describe("data of content."),
          metadata: z.object({
            keywords: z.array(z.string()).optional().describe("keywords to content."),
            description: z.string().optional().describe("description to content."),
          }).optional().describe("generate metadata to content."),
        })
      ).describe("the database."),
      details: z.string().describe("relevant details based on intetion."),
      updated: z.boolean().describe("if the database was updated.")
    })
  );

  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(
      `You're a Database Manager. Consider the object below as a database:
      \`\`\`json
      {memory}
      \`\`\`
      ---
      {format_instructions}
      Use the instruction below to add, edit, or remove information from the database.
      Ensure good data organization, use pages to organize contexts, and use metadata to store keywords.
      {context}
      Instruction: {instruction}`
    ),
    new ChatModel(),
    parser
  ]);

  const response = await chain.invoke({
    memory: JSON.stringify(memory),
    context: context ? `Instruction Context: ${JSON.stringify(context || [])}` : '',
    instruction,
    format_instructions: parser.getFormatInstructions(),
  });

  return {
    database: response.database as IAIEmployeeMemory[],
    details: response.details as string,
    updated: response.updated as boolean,
  };
}
