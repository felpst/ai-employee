import 'dotenv/config';
import { MailToolSettings } from './mail.interfaces';
import { MailService } from './mail.service';

describe('Get Emails', () => {
  jest.setTimeout(600000)

  const settings: MailToolSettings = {
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
      timeout: 60000
    },
    imap: {
      host: 'imap.gmail.com',
      port: 993,
      tls: true
    },
    tools: {
      send: false,
      read: true,
    }
  }

  it('should get emails successfully', async () => {
    const mailService = new MailService(settings)
    const emails = await mailService.find({ qt: 5 })
    expect(emails.length).toBe(5)
  })

  it('should find emails by date successfully', async () => {
    const mailService = new MailService(settings)
    const emails = await mailService.find({
      since: 'December 10, 2023',
      from: 'linecker@cognum.ai'
    })
    expect(emails.length).toBeGreaterThan(0)
  })

  it('should find emails by sender email successfully', async () => {
    const mailService = new MailService(settings)
    const emails = await mailService.find({
      from: 'venilton@cognum.ai'
    })
    expect(emails.length).toBeGreaterThan(0)
  })

  it('should find emails by subject successfully', async () => {
    const mailService = new MailService(settings)
    const emails = await mailService.find({
      subject: 'Teste',
      status: 'ALL'
    })
    expect(emails.length).toBeGreaterThan(0)
  })

  it('should find unseen emails', async () => {
    const mailService = new MailService(settings)
    const emails = await mailService.find({
      status: 'UNSEEN'
    })
    console.log(emails.map(e => e.date));
    expect(emails.length).toBeGreaterThan(0)
  })
})
