import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { MailToolSettings } from './mail.interfaces';
import { MailService } from './mail.service';

export class MailReadTool extends DynamicStructuredTool {

  constructor(settings: MailToolSettings) {
    super({
      name: 'Read Email',
      description: 'Use to read emails from inbox, you can filter by date, sender and subject.',
      schema: z.object({
        qt: z.number().default(10).describe('number of emails to be read.'),
        date: z.string().describe('date of the email.').optional(),
        from: z.string().describe('sender of the email.').optional(),
        subject: z.string().describe('subject of the email.').optional(),
      }),
      metadata: { id: "mail", tool: "read" },
      func: async ({ qt, date, from, subject }) => {
        try {
          const mailService = new MailService(settings);
          const filters = { qt, date, from, subject };
          const mails = await mailService.find(filters);
          return 'List of emails: ```json\n' + JSON.stringify(mails, null, 2) + '\n```';
        } catch (error) {
          console.error(error);
          return error.message;
        }
      },
    });
  }
}
