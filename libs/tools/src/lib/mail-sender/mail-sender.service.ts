import * as nodemailer from 'nodemailer';
import { MailSenderSettings } from './mail-sender.interfaces';
export class MailSenderService {
    private _settings: MailSenderSettings

    constructor (settings: MailSenderSettings) {
        this._settings = settings;
    }

    send(to: string,
        subject: string,
        message: string,
        ): Promise<string> {
        return new Promise((resolve, reject) => {
            const mailOptions = {
                from: this._settings.user,
                to,
                subject,
                html: message
            };

            const transporter = nodemailer.createTransport({
                service: this._settings.service,
                secure: false,
                auth: {
                    user: this._settings.user,
                    pass: this._settings.password
                },
                tls: { rejectUnauthorized: false }
            });

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






