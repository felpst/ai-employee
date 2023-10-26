import { ChatModel } from '@cognum/llm';
import {
    initializeAgentExecutorWithOptions
} from 'langchain/agents';
import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { Mail } from './utils/send-email.service';

export class SendEmailTool extends DynamicStructuredTool {
  constructor() {
    super({
      name: 'Send Email',
      description:
        'Use to send email to a recipient a subject and a message input the tool in that order.',
      schema: z.object({
        to: z.string().describe('recipient email'),
        subject: z.string().describe('title of the email to be sent'),
        message: z.string().describe('message of the email to be sent')
      }),
      func: async ({to, subject, message}) => {
        console.log('------------SendEmailTool------------');

        const model = new ChatModel();
        const tools = [ new Mail(to, subject, message) ]

        const executor = await initializeAgentExecutorWithOptions(
          tools,
          model,
          {
            agentType: 'zero-shot-react-description',
            verbose: true,
          }
        );

        const result = await executor.call({ input });
        console.log(`Got output ${result.output}`);
        console.log('------------SendEmailTool------------');
        return result.output;
      },
    });
  }
}
