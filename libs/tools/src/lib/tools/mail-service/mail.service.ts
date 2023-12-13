import * as Imap from 'imap';
import { simpleParser } from 'mailparser';
import * as nodemailer from 'nodemailer';
import { Email, MailReaderSettings, MailSenderSettings } from './mail.interfaces';

export class MailService {
  private _senderSettings: MailSenderSettings
  private _readerSettings: MailReaderSettings

  constructor(senderSettings: MailSenderSettings, readerSettings: MailReaderSettings) {
    this._senderSettings = senderSettings;
    this._readerSettings = readerSettings;
  }

  send(to: string[], cc: string[], bcc: string[], subject: string, message: string,): Promise<string> {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: this._senderSettings.auth.user,
        to,
        cc,
        bcc,
        subject,
        html: message
      };

      const transporter = nodemailer.createTransport(this._senderSettings);

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve('Email sent successfully');
        }
      });
    });
  }

  async getEmails(qt: number = 10, date?: string, from?: string, subject?: string): Promise<any[]> {
    return new Promise((resolve, reject) => {

      const filter = []
      if (!date && !from && !subject) filter.push(`1:${qt}`)
      if (date) filter.push(['SINCE', date])
      if (from) filter.push(['FROM', from])
      if (subject) filter.push(['SUBJECT', subject])

      console.log(filter)

      const imap = new Imap(this._readerSettings)

      const resultsArray = []

      if (imap.state !== 'authenticated') {
        imap.connect()
      }

      function openInbox(cb) {
        imap.openBox('INBOX', true, cb);
      }

      imap.once('ready', async () => {
        await openInbox(async function (err, box) {
          if (err) reject(err)

          imap.search(filter, async (err, results) => {
            if (err) reject(err)

            const f = await imap.fetch(results, {
              bodies: '',
              struct: true
            })

            f.on('message', (msg, seqno) => {
              let mailContent = '';
              console.log('Message #%d', seqno);

              const prefix = '(#' + seqno + ') ';

              msg.on('body', (stream) => {

                stream.on('data', (chunk) => {
                  mailContent += chunk.toString('utf8')
                })
              })

              msg.once('attributes', (attrs) => {
                simpleParser(mailContent, (err, mail) => {
                  if (err) reject(err)

                  console.log(`Email ${seqno}: ${mail.messageId}`);
                  resultsArray.push(mail)
                })
              });

              msg.once('end', () => {
                console.log(prefix + 'Finished');
              });
            });

            f.once('error', (err) => {
              console.log('Fetch error: ' + err);
            });

            f.once('end', () => {
              console.log('Done fetching all messages!');
              imap.end();
            });

          });
        });

        imap.once('error', (err) => {
          reject(err);
        });

        imap.once('end', () => {
          console.log('Connection ended');
          resultsArray.map(result => {
            const email = new Email(result)

            console.log(email)

            return email
          })
          resolve(resultsArray)
        });

      });
    })

  }
}

