import * as Imap from 'imap';
import { simpleParser } from 'mailparser';
import * as moment from 'moment';
import * as nodemailer from 'nodemailer';
import { Email, MailData, MailFilters, MailToolSettings } from './mail.interfaces';

export class MailService {

  constructor(
    private settings: MailToolSettings
  ) { }

  send(emailData: MailData): Promise<void> {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: emailData.from,
        to: emailData.to,
        cc: emailData.cc,
        bcc: emailData.bcc,
        subject: emailData.subject,
        html: emailData.html,
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


  // TODO Criar uma interface
  async find(filters: MailFilters = {
    qt: 5,
    since: undefined,
    from: undefined,
    subject: undefined
  }): Promise<Email[]> {
    return new Promise((resolve, reject) => {
      const emails: Email[] = []

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


      // Config
      const config: Imap.Config = {
        user: this.settings.auth.user,
        password: this.settings.auth.pass,
        host: this.settings.imap.host,
        port: this.settings.imap.port,
        tls: this.settings.imap.tls,
        tlsOptions: {
          servername: this.settings.imap.host
        },
        authTimeout: this.settings.auth.timeout || 3000
      }
      const imap = new Imap(config)


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
          if (err) reject(err)

          imap.search(filter, async (err, results) => {
            console.log('searching...');

            if (err) reject(err)

            const f = await imap.fetch(results, {
              bodies: '',
              struct: true
            })

            f.on('message', (msg, seqno) => {
              let mailContent = ''
              console.log('Message #%d', seqno);
              // const prefix = '(#' + seqno + ') ';

              msg.on('body', (stream) => {
                stream.on('data', (chunk) => {
                  mailContent += chunk.toString('utf8')
                })
              })

              msg.once('attributes', (attrs) => {
                simpleParser(mailContent, (err, mail) => {
                  if (err) reject(err)
                  mailResults.push(mail)
                  // console.log(`Email ${seqno}: ${mail.messageId}`);
                })
              });

              // msg.once('end', () => {
              //   console.log(prefix + 'Finished');
              // });
            });

            f.once('error', (err) => {
              console.log('Fetch error: ' + err);
            });

            f.once('end', () => {
              // console.log('Done fetching all messages!');
              imap.end();
            });

          });
        });

        imap.once('error', (err) => {
          // console.error(err);
          reject(err);
        });

        imap.once('end', () => {
          // console.log('Connection ended');
          for (const mail of mailResults) {
            const email = {
              subject: mail.subject,
              from: mail.from.text,
              id: mail.messageId,
              date: mail.date,
              text: mail.text,
              // html: mail.html,
              attachments: mail.attachments,
              references: mail.references,
            }
            emails.push(email)
          }
          resolve(emails)
        });

      });
    })

  }
}

