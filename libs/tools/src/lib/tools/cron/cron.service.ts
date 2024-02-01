import { ChatModel } from '@cognum/llm';
import { StructuredOutputParser } from 'langchain/output_parsers';
import {
  PromptTemplate
} from "@langchain/core/prompts";
import { RunnableSequence } from '@langchain/core/runnables';
import { z } from 'zod';

export class CronService {

  static async fromText(text: string) {
    if (!text) return {
      formattedCron: '*/15 * * * *',
      formattedInput: 'every 15 minutes',
      isValidCron: true,
    };

    const parser = StructuredOutputParser.fromZodSchema(
      z.object({
        formattedCron: z.string().describe("cron formatted for the input, such as * * * * * or 0 0 1 * * or 0 0 * * * or 0 0 0 * * or 0 0 0 1 * or 0 0 0 1 1 or 0 0 0 1 1 1"),
        formattedInput: z.string().describe("input formatted for the cron job, such as every minute, every month, every day at 7pm, etc."),
        isValidCron: z.boolean().describe("if the output is a valid cron job."),
        runOnce: z.boolean().describe("if the cron job is to run once."),
        date: z.string().describe("date of the start cron job.").optional(),
      })
    );

    const chain = RunnableSequence.from([
      PromptTemplate.fromTemplate(
        `Task: Transform text into cron time format.
        - If the input is a date or time, return the cron time format for that date or time.

        Examples:
        - every minute: * * * * *
        - every month: 0 0 1 *
        - every day at 7pm: 0 19 * * *
        - every hour: 0 * * * *
        - every day: 0 0 * * *
        - tomorrow at 7pm: 0 19 * * *
        - start of the day: 0 7 * * *
        - end of the day: 0 17 * * *

        {format_instructions}
        User input: {input}`
      ),
      new ChatModel(),
      parser,
    ]);

    // console.log(parser.getFormatInstructions());

    const response = await chain.invoke({
      input: text,
      format_instructions: parser.getFormatInstructions(),
    });

    if (!response.isValidCron) {
      return {
        formattedCron: '*/15 * * * *',
        formattedInput: 'every 15 minutes',
        isValidCron: true,
      };
    }

    // console.log(response);
    return response;
  }

}

