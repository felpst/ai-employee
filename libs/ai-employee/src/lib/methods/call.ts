import { IAgent, IAgentCall, IMemorySearchResult } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";
import { z } from "zod";
import { ConfigurationAgent } from "../agents/configuration";
import { GeneralAgent } from "../agents/general";
import { InformationRetrievalAgent } from "../agents/information-retrieval";
import { TaskExecutionAgent } from "../agents/task-execution";
import { INTENTIONS, intentClassifier } from "../utils/intent-classifier/intent-classifier.util";

export async function aiEmployeeCall(input: string): Promise<IAgentCall> {
  const intentClassifierResult = await intentClassifier(input);
  console.log(intentClassifierResult);

  // TODO Planning action
  // TODO While to check if the input is atteded

  // Agent
  let agent: IAgent;
  let agentCall: IAgentCall;
  switch (intentClassifierResult.intention) {
    case INTENTIONS.INFORMATION_RETRIEVAL:
      agent = new InformationRetrievalAgent(this)
      agentCall = await agent.call(input, intentClassifierResult.intention)
      break;
    case INTENTIONS.TASK_EXECUTION:
      agent = await new TaskExecutionAgent(this).init()
      agentCall = await agent.call(input, intentClassifierResult.intention)
      break;
    case INTENTIONS.CONFIGURATION_OR_CUSTOMIZATION:
      agent = await new ConfigurationAgent(this).init()
      agentCall = await agent.call(input, intentClassifierResult.intention)
      break;
    default:
      agent = await new GeneralAgent(this).init()
      agentCall = await agent.call(input, intentClassifierResult.intention)
      break;
  }

  // TODO Check answer accuracy

  // Generate final answer
  await finalAnswer(agentCall);

  return agentCall;
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
