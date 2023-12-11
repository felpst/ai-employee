import { ChatModel } from "@cognum/llm";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";
import { z } from "zod";

export const INTENTIONS = {
  INFORMATION_RETRIEVAL: "Information Retrieval",
  TASK_EXECUTION: "Task Execution",
  ASSISTANCE_OR_SUPPORT: "Assistance or Support",
  ANALYSIS_OR_EVALUATION: "Analysis or Evaluation",
  FEEDBACK_OR_OPINION: "Feedback or Opinion",
  SOCIAL_INTERACTION_OR_ENGAGEMENT: "Social Interaction or Engagement",
  EXPLORATION_OR_RESEARCH: "Exploration or Research",
  CONFIGURATION_OR_CUSTOMIZATION: "Configuration or Customization",
};


export async function intentClassifier(input: string) {
  // TODO Adicionar contexto para classificar a intenção com mais eficiência.
  // Como por exemplo, se o usuário está em um chat de suporte, a intenção provavelmente será 'Assistance or Support'.
  // Se o usuário está em um chat de configuração, a intenção provavelmente será 'Configuration or Customization'.
  // Se o usuário está em um chat de pesquisa, a intenção provavelmente será 'Exploration or Research'.

  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      intention: z.string().describe("identified intention cateogry of the input."),
      details: z.string().describe("relevant details based on intetion.")
    })
  );

  /**
   *
      - If the input is seeking help or support on an issue, categorize as 'Assistance or Support'.
      - If the input requires deep analysis or evaluation, categorize as 'Analysis or Evaluation'.
      - If the input is about providing feedback or an opinion, categorize as 'Feedback or Opinion'.
      - If the input is seeking social interaction or casual engagement, categorize as 'Social Interaction or Engagement'.
      - If the input is about exploring options or conducting broad research, categorize as 'Exploration or Research'.
      - If the input is to adjust settings or personalize, categorize as 'Configuration or Customization'.
      - If the input is providing specific information, categorize as 'Configuration or Customization'.
   */

  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(
      `Task: Analyze the request and identify the primary intention.
      - If the input is a direct question or seeks specific information, categorize as 'Information Retrieval'.
      - If the input requests a specific action to be performed, categorize as 'Task Execution'.
      - If the input is providing specific information, categorize as 'Configuration or Customization'.

      {format_instructions}
      User input: {input}`
    ),
    new ChatModel(),
    parser,
  ]);

  // console.log(parser.getFormatInstructions());

  const response = await chain.invoke({
    input,
    format_instructions: parser.getFormatInstructions(),
  });

  // console.log(response);
  return response;
}
