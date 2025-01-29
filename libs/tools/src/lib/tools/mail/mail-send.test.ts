import 'dotenv/config';
import { agentTest } from '../../tests/agent-test';
import { MailSendTool } from './mail-send.tool';
import { MailToolSettings } from './mail.interfaces';

describe('MailSendTool test', () => {
  jest.setTimeout(300000)
  let executor = null;

  const settings: MailToolSettings = {
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
      timeout: 60000
    },
    smtp: {
      host: 'smtp.gmail.com',
      port: 465,
      tls: true,
    },
    tools: {
      send: true,
      read: false,
    }
  }

  beforeAll(async () => {
    const tools = [
      new MailSendTool(settings),
    ];
    executor = await agentTest(tools);
  });

  it('should send email successfully', async () => {
    const result = await executor.call({ input: 'send email to linecker@cognum.ai with a joke' });
    expect(result.output).toContain('successfully');
  })

  it('should send email for multiple destinations', async () => {
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
