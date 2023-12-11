import { ChatModel } from '@cognum/llm';
import { LLMChain } from "langchain/chains";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";

export async function cron() {

}

export async function textToCron(text: string) {
  const template =
    "You are a helpful assistant that transforms text into cron time. You must return only the result. If it is not possible to create a cron scheduler based on the input, return 'INVALID_INPUT'";
  const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(template);
  const humanTemplate = "{text}";
  const humanMessagePrompt =
    HumanMessagePromptTemplate.fromTemplate(humanTemplate);

  const chatPrompt = ChatPromptTemplate.fromMessages([
    systemMessagePrompt,
    humanMessagePrompt,
  ]);

  const chain = new LLMChain({
    llm: new ChatModel(),
    prompt: chatPrompt,
  });

  const { text: result } = await chain.call({ text });

  if (result === 'INVALID_INPUT')
    throw new Error(`Cannot generate cron for input "${text}"`);

  return result;
}
