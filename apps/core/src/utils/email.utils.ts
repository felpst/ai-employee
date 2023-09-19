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
      subject: 'Welcome to Cognum!',
      text: "Welcome to COGNUM. Let's go together in search of a promising future with AI's. This is an automatic email from the system, you do not need to respond to it.",
    };
    return await transporter.sendMail(options);
  }
}

export default new EmailUtils();
