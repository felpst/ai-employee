import { simpleParser } from 'mailparser';
import * as nodemailer from 'nodemailer';
import { Email, MailFilters, MailToolSettings, SendMailData } from './mail.interfaces';
const Imap = require('imap');
const moment = require('moment');

export class MailService {

  constructor(
    private settings: MailToolSettings
  ) { }

  send(emailData: SendMailData): Promise<void> {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: this.settings.from || emailData.from,
        to: emailData.to,
        replyTo: this.settings.replyTo || emailData.replyTo,
        cc: emailData.cc,
        bcc: emailData.bcc,
        subject: emailData.subject,
        text: emailData.text ? emailData.text : emailData.html,
        html: emailData.html ? emailData.html : emailData.text,
      };

      const transport = {
        host: this.settings.smtp.host,
        port: this.settings.smtp.port,
        secure: this.settings.smtp.tls,
        auth: {
          user: this.settings.auth.user,
          pass: this.settings.auth.pass,
        },
      };
      const transporter = nodemailer.createTransport(transport);

      transporter.sendMail(mailOptions, (error) => {
        return error ? reject(error) : resolve();
      });
    });
  }

  get imapConfig() {
    return {
      user: this.settings.auth.user,
      password: this.settings.auth.pass,
      host: this.settings.imap.host,
      port: this.settings.imap.port,
      tls: this.settings.imap.tls,
      tlsOptions: {
        servername: this.settings.imap.host
      },
      authTimeout: this.settings.auth.timeout || 30000
    }
  }

  // TODO Criar uma interface
  async find(filters: MailFilters = {
    qt: 5,
    since: undefined,
    from: undefined,
    subject: undefined
  }): Promise<Email[]> {
    return new Promise((resolve, reject) => {
      let emails: Email[] = []

      // Filters
      if (!filters.qt) filters.qt = 5;
      if (!filters.since) filters.since = moment().subtract(30, 'days').toDate()
      if (filters.qt > 100) filters.qt = 100;

      const filter = []
      if (!filters.since && !filters.from && !filters.subject && !filters.status) filter.push(`1:${filters.qt}`)
      if (filters.since) filter.push(['SINCE', filters.since])
      if (filters.from) filter.push(['FROM', filters.from])
      if (filters.subject) filter.push(['SUBJECT', filters.subject])
      if (filters.status) filter.push(filters.status)
      console.log(filter);

      // Imap
      const imap = new Imap(this.imapConfig)

      if (imap.state !== 'authenticated') {
        imap.connect()
      }

      imap.once('error', (err) => {
        reject(err);
      });

      function openInbox(cb) {
        imap.openBox('INBOX', true, cb);
      }

      imap.once('ready', async () => {
        const mailResults: any[] = [];

        await openInbox(async function (err, box) {
          console.log('openBox');
          if (err) imap.end()

          imap.search(filter, async (err, results) => {
            console.log('searching...');

            if (err) return imap.end()

            try {
              const f = await imap.fetch(results, {
                bodies: '',
                struct: true
              })

              f.on('message', (msg, seqno) => {
                let mailContent = ''
                // console.log('Message #%d', seqno);
                // const prefix = '(#' + seqno + ') ';

                msg.on('body', (stream) => {
                  stream.on('data', (chunk) => {
                    mailContent += chunk.toString('utf8')
                  })
                })

                msg.once('attributes', (attrs) => {
                  simpleParser(mailContent, (err, mail) => {
                    if (err) imap.end()
                    mailResults.push({
                      uid: attrs.uid,
                      ...mail
                    })
                    // console.log(`Email ${seqno}: ${mail.messageId}`);
                  })
                });
              });

              f.once('error', (err) => {
                // console.log('Fetch error: ' + err);
              });

              f.once('end', () => {
                // console.log('Done fetching all messages!');
                imap.end();
              });
            } catch (error) {
              console.log(error.message);
              imap.end();
            }

          });
        });

        imap.once('error', (err) => {
          imap.end();
        });

        imap.once('end', () => {
          // console.log('Connection ended');
          for (const mail of mailResults) {
            const email = {
              id: mail.messageId,
              uid: mail.uid,
              subject: mail.subject,
              from: mail.from.text,
              to: mail.to.text,
              date: mail.date,
              text: mail.text,
              // html: mail.html,
              attachments: mail.attachments,
              references: mail.references,
            }
            emails.push(email)
          }

          // Filter by to
          if (filters.to) emails = emails.filter(email => email.to === filters.to);

          resolve(emails)
        });

      });
    })

  }

  async markAsRead(uid: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Timeout 10s to reject
      setTimeout(() => { imap.end(); reject('Timeout'); }, 30000);

      const imap = new Imap(this.imapConfig)

      if (imap.state !== 'authenticated') {
        imap.connect()
      }

      imap.once('error', (error: Error) => {
        imap.end();
        reject(error);
      });

      imap.once('ready', async () => {
        console.log('ready');
        imap.openBox('INBOX', false, (error, box) => {
          if (error) { imap.end(); return reject(error); }

          imap.addFlags(uid, ['SEEN'], (error) => {
            imap.end();
            if (error) { return reject(error); }
            resolve()
          })
        });
      });
    });
  }
}

