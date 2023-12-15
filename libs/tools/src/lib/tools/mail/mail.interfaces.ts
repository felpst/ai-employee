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
  since?: string | Date
  from?: string
  to?: string
  subject?: string
  status?: 'ALL' | 'NEW' | 'UNSEEN' | 'SEEN' | 'FLAGGED' | 'UNFLAGGED' | 'RECENT' | 'OLD' | 'ANSWERED' | 'UNANSWERED' | 'DELETED' | 'UNDELETED' | 'DRAFT' | 'UNDRAFT'
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

export interface Email {
  id: string
  uid: string
  subject: string
  from: string
  to?: string
  date: string
  text: string
  // html: string
  attachments: string
  references: string
}
