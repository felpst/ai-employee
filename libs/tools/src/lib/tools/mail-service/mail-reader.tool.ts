import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { MailReaderSettings, MailSenderSettings } from './mail.interfaces';
import { MailService } from './mail.service';

export class MailReaderTool extends DynamicStructuredTool {

  constructor(settingsSender: MailSenderSettings, settingsReader: MailReaderSettings) {
    super({
      name: 'Read Email',
      description: 'Use to get and read email.',
      schema: z.object({
        qt: z.number().default(10).describe('number of emails to be read.'),
        date: z.string().describe('date of the email.').optional(),
        from: z.string().describe('sender of the email.').optional(),
        subject: z.string().describe('subject of the email.').optional(),
      }),
      metadata: { id: "mail-reader" },
      func: async ({ qt, date, from, subject }) => {
        try {
          const mailService = new MailService(settingsSender, settingsReader);
          return await mailService.getEmails(qt, date, from, subject);
        } catch (error) {
          console.error(error);
          return error.message;
        }
      },
    });
  }
}
