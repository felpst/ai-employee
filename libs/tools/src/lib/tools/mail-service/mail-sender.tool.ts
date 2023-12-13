import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { MailReaderSettings, MailSenderSettings } from './mail.interfaces';
import { MailService } from './mail.service';

export class MailSenderTool extends DynamicStructuredTool {

  constructor(settingsSender: MailSenderSettings, settingsReader: MailReaderSettings) {
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
      metadata: { id: "mail-sender" },
      func: async ({ to, cc, bcc, subject, message }) => {
        try {
          const mailService = new MailService(settingsSender, settingsReader);
          return await mailService.send(to, cc, bcc, subject, message);
        } catch (error) {
          console.error(error);
          return error.message;
        }
      },
    });
  }
}
