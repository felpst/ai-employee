export interface MailToolSettings {
  auth: {
    user: string,
    pass: string
    timeout?: number
  },
  smtp?: {
    host: string,
    port: number,
    tls: boolean,
  },
  imap?: {
    host: string
    port: number
    tls: boolean
  },
  tools: {
    send: boolean,
    read: boolean,
  }
}

export interface MailFilters {
  qt?: number,
  since?: string
  from?: string
  subject?: string
}

export interface MailData {
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  text?: string;
  html?: string;
  date?: string;
}

export class Email implements MailData {
  date: string;
  subject: string;
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  text?: string;
  html?: string;

  constructor(params: MailData) {
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

