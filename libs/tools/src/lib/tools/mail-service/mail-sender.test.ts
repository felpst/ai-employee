import 'dotenv/config';
import { agentTest } from '../../tests/agent-test';
import { MailSenderTool } from './mail-sender.tool';
import { MailReaderSettings, MailSenderSettings } from './mail.interfaces';

describe('SendEmail tool test', () => {
  jest.setTimeout(300000)
  let executor = null;

  beforeAll(async () => {
    const settingsSender: MailSenderSettings = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      }
    };

    const settingsReader: MailReaderSettings = {
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

    const tools = [
      new MailSenderTool(settingsSender, settingsReader),
    ];
    executor = await agentTest(tools);
  });

  it('should send email successfully', async () => {
    const result = await executor.call({ input: 'send email to venilton@cognum.ai and linecker@cognum.ai, subject with a joke' });
    expect(result.output).toContain('successfully');
  })

  it('should send email with cc successfully', async () => {
    const result = await executor.call({ input: 'send email to venilton@cognum.ai and copy linecker@cognum.ai, subject with a joke' });
    expect(result.output).toContain('successfully');
  })

  it('should send email with bcc successfully', async () => {
    const result = await executor.call({ input: 'send email to linecker@cognum.ai and blind copy venilton@cognum.ai, subject with a joke' });
    expect(result.output).toContain('successfully');
  })

});
