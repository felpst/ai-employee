import nodemailer, { SendMailOptions } from 'nodemailer';

export class EmailService {
  private static credentials = {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  };
  private static transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: this.credentials,
  });

  static send(mailOptions: SendMailOptions): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const _opts = {
        ...mailOptions,
        from: this.credentials.user,
        replyTo: "hello+reply@cognum.ai",
      };
      this.transporter.sendMail(_opts, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  }

}
