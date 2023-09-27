import nodemailer, { SendMailOptions } from 'nodemailer';

export class EmailUtils {
  async sendMail(mailOptions: Partial<SendMailOptions>) {
    const credentials = {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    };
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: credentials,
    });
    const options: SendMailOptions = {
      ...mailOptions,
      from: credentials.user,
      replyTo: credentials.user,
    };
    return await transporter.sendMail(options);
  }
}

export default new EmailUtils();
