import * as nodemailer from 'nodemailer';
import { MailSenderSettings } from './mail-sender.interfaces';
export class MailSenderService {
  private _settings: MailSenderSettings

  constructor(settings: MailSenderSettings) {
    this._settings = settings;
  }

  send(to: string, subject: string, message: string,): Promise<string> {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: this._settings.auth.user,
        to,
        subject,
        html: message
      };

      const transporter = nodemailer.createTransport(this._settings);

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve('Email sent successfully');
        }
      });
    });
  }
}






