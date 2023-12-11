export interface MailSenderSettings {
  host: string,
  port: number,
  secure: boolean,
  auth: {
    user: string,
    pass: string
  }
}

export interface MailReaderSettings {
  user: string
  password: string
  host: string
  port: number
  tls: boolean
  tlsOptions: {
    servername: string
  }
  authTimeout: 60000
}

export interface EmailData {
  date: string;
  subject: string;
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  text?: string;
  html?: string;
}

export class Email implements EmailData {
  date: string;
  subject: string;
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  text?: string;
  html?: string;

  constructor(params: EmailData) {
    this.date = params.date;
    this.subject = params.subject;
    this.from = params.from;
    this.to = params.to;
    this.cc = params.cc;
    this.bcc = params.bcc;
    this.text = params.text;
    this.html = params.html;
  }
}

