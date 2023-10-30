import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { MailSenderSettings } from './mail-sender.interfaces';
import { MailSenderService } from './mail-sender.service';

export class MailSenderTool extends DynamicStructuredTool {

  constructor(settings: MailSenderSettings) {
    super({
      name: 'Send Email',
      description:
        'Use to send email.',
      schema: z.object({
        to: z.string().describe('a recipent valid email address to be sent.'),
        subject: z.string().describe('subject of the email to be sent.'),
        message: z.string().describe('message of the email to be sent.'),
      }),
      func: async ({to, subject, message}) => {
        try {
          const mailSenderService = new MailSenderService(settings); 
          return await mailSenderService.send(to,subject,message);
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
