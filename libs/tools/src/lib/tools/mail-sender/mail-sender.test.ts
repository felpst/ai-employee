import 'dotenv/config';
import { agentTest } from '../../tests/agent-test';
import { MailSenderSettings } from './mail-sender.interfaces';
import { MailSenderTool } from './mail-sender.tool';

describe('SendEmail tool test', () => {
  jest.setTimeout(300000)
  let executor = null;

  beforeAll(async () => {
    const settings: MailSenderSettings = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      }
    };

    const tools = [
      new MailSenderTool(settings),
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
