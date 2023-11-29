import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { MailSenderSettings } from './mail-sender.interfaces';
import { MailSenderService } from './mail-sender.service';

export class MailSenderTool extends DynamicStructuredTool {

  constructor(settings: MailSenderSettings) {
    super({
      name: 'Send Email',
      description: 'Use to send email.',
      schema: z.object({
        to: z.string().describe('an array with a recipient valid emails address to be sent.'),
        cc: z.string().describe('an array with a recipient valid emails address to be sent as a carbon copy.').optional(),
        bcc: z.string().describe('an array with a recipient valid emails address to be sent as a blind carbon copy.').optional(),
        subject: z.string().describe('subject of the email to be sent.'),
        message: z.string().describe('message of the email to be sent.'),
      }),
      metadata: { id: "mailer-send" },
      func: async ({ to, cc, bcc, subject, message }) => {
        try {
          const mailSenderService = new MailSenderService(settings);
          return await mailSenderService.send(to, cc, bcc, subject, message);
        } catch (error) {
          console.error(error);
          return error.message;
        }
      },
    });
  }
}
