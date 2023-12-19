import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { MailData, MailToolSettings } from './mail.interfaces';
import { MailService } from './mail.service';
export class MailSendTool extends DynamicStructuredTool {

  constructor(settings: MailToolSettings) {
    super({
      name: 'Send Email',
      description: 'Use to send emails to one or more recipients, with or without carbon copy and blind carbon copy, with a subject and a message, the message can be in plain text or in HTML format, the message will be sent to the recipients in the "to" field, the recipients in the "cc" field will receive a carbon copy of the message and the recipients in the "bcc" field will receive a blind carbon copy of the message, the sender will be the email address configured in the settings, the sender can be changed by the "from" field, the sender will also receive a copy of the email',
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
        message: z.string().describe('message of the email to be sent in markdown format.'),
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
          }
          await mailService.sendMarkdown(emailData);
          return 'Email sent successfully.';
        } catch (error) {
          console.error(error);
          return error.message;
        }
      },
    });
  }
}
