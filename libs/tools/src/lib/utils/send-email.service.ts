import * as nodemailer from 'nodemailer';
import {
    Configs
} from './configEmail';

export class Mail {
    private _config = new Configs();
    private _to: string;
    private _subject: string;
    private _message: string;

    constructor(
        to?: string,
        subject?: string,
        message?: string,
    ) {
        this._to = to || '';
        this._subject = subject || '';
        this._message = message || '';
    }

    sendMail(): Promise<string> {
        return new Promise((resolve, reject) => {
            const mailOptions = {
                from: this._config.user,
                to: this._to,
                subject: this._subject,
                html: this._message
            };

            const transporter = nodemailer.createTransport({
                service: this._config.service,
                secure: false,
                auth: {
                    user: this._config.user,
                    pass: this._config.password
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






