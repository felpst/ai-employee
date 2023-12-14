import 'dotenv/config';
import { MailReaderSettings, MailSenderSettings } from './mail.interfaces';
import { MailService } from './mail.service';

describe('Get Emails', () => {
  jest.setTimeout(60000)
  let settingsReader: MailReaderSettings
  let settingsSender: MailSenderSettings

  beforeAll(async () => {
    settingsSender = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      }
    }

    settingsReader = {
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: {
        servername: 'imap.gmail.com'
      },
      authTimeout: 60000
    };
  });

  it('should get emails successfully', async () => {
    const mailService = new MailService(settingsSender, settingsReader)
    const emails = await mailService.getEmails()
    expect(emails.length).toBe(10)
  })

  it('should find emails by date successfully', async () => {
    const mailService = new MailService(settingsSender, settingsReader)
    const emails = await mailService.getEmails(undefined, 'November 20, 2023')
    expect(emails.length).toBeGreaterThan(0)
  })

  it('should find emails by sender email successfully', async () => {
    const mailService = new MailService(settingsSender, settingsReader)
    const emails = await mailService.getEmails(undefined, undefined, 'venilton@cognum.ai')
    expect(emails.length).toBeGreaterThan(0)
  })

  it('should find emails by subject successfully', async () => {
    const mailService = new MailService(settingsSender, settingsReader)
    const emails = await mailService.getEmails(10, undefined, undefined, 'Teste')
    expect(emails.length).toBeGreaterThan(0)
  })
})