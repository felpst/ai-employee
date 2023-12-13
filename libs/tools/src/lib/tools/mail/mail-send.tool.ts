import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { MailData, MailToolSettings } from './mail.interfaces';
import { MailService } from './mail.service';

export class MailSendTool extends DynamicStructuredTool {

  constructor(settings: MailToolSettings) {
    super({
      name: 'Send Email',
      description: 'Use to send email.',
      schema: z.object({
        to: z.array(
          z.string().email().describe('a valid email recipient address to be sent.'),
        ),
        cc: z.array(
          z.string().email().describe('a valid email recipient address to be sent as a carbon copy.'),
        ).optional(),
        bcc: z.array(
          z.string().email().describe('a valid email recipient address to be sent as a blind carbon copy.'),
        ).optional(),
        subject: z.string().describe('subject of the email to be sent.'),
        message: z.string().describe('message of the email to be sent.'),
      }),
      metadata: { id: "mail", tool: "send" },
      func: async ({ to, cc, bcc, subject, message }) => {
        try {
          const mailService = new MailService(settings);
          const emailData: MailData = {
            subject,
            from: settings.auth.user,
            to: to.join(', '),
            cc: cc?.join(', '),
            bcc: bcc?.join(', '),
            text: message,
            html: message,
          }
          await mailService.send(emailData);
          return 'Email sent successfully.';
        } catch (error) {
          console.error(error);
          return error.message;
        }
      },
    });
  }
}
