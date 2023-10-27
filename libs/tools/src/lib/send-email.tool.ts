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
        to: z.string().email().describe('recipient email'),
        subject: z.string().describe('title of the email to be sent'),
        message: z.string().describe('message of the email to be sent')
      }),
      func: async ({to, subject, message}) => {

          const mail =  new Mail(to, subject, message); 
        
          await mail.sendMail();
          return `Your email has been delivered to ${to}`;
      },
    });
  }
}
