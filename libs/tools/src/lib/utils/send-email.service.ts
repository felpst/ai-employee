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

    sendEmail() {
        const mailOptions = {
            from: "ta.funcionando15@gmail.com",
            to: this._to,
            subject:this._subject,
            html: this._message
        };
        
        const transporter = nodemailer.createTransport({
            host: this._config.host,
            port: this._config.port,
            secure: false,
            auth: {
                user:this._config.user,
                pass: this._config.password
            },
            tls: { rejectUnauthorized: false }
        });

        console.log(mailOptions);

        transporter.sendMail(mailOptions, function (error) {
            if(error) {
                return error;
            }
            return 'Email sent successfully'
        });
        

    }

}