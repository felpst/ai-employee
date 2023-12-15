import { RepositoryHelper } from "@cognum/helpers";
import { IAIEmployeeCall, IAIEmployeeCallData, IAgentCall, IMemorySearchResult } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";
import { z } from "zod";
import { AIEmployeeCall } from "../call/call.model";

export async function aiEmployeeCall(data: IAIEmployeeCallData): Promise<IAIEmployeeCall> {
  const repository = new RepositoryHelper<IAIEmployeeCall>(AIEmployeeCall);
  const call = await repository.create({
    input: data.input,
    aiEmployee: this._id,
    createdBy: data.user,
    updatedBy: data.user,
    context: data.context || {},
  }) as IAIEmployeeCall;
  await call.populate('aiEmployee');
  return call;
}

async function finalAnswer(agentCall: IAgentCall): Promise<IMemorySearchResult> {
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      answer: z.string().describe("the answer for the user.")
    })
  );

  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(
      `Task: You need to create a friendly answer like a chat for the user using only data below:
      User Input: {input}
      Process Output: {output}
      ---
      {format_instructions}`
    ),
    new ChatModel(),
    parser,
  ]);

  const response = await chain.invoke({
    input: agentCall.input,
    output: agentCall.output,
    format_instructions: parser.getFormatInstructions(),
  });

  agentCall.output = response.answer;
  return response;
}
