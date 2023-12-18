import { DatabaseHelper, RepositoryHelper } from '@cognum/helpers';
import { IAIEmployee } from '@cognum/interfaces';
import { User } from '@cognum/models';
import { MailService } from '@cognum/tools';
import 'dotenv/config';
import mongoose from 'mongoose';
import { AIEmployeeRepository } from '../../repositories';
import { AIEmployeeTools } from '../../tools/ai-employee-tools';
import { INTENTIONS } from '../../utils/intent-classifier/intent-classifier.util';
import { GeneralAgent } from './general.agent';

describe('InformationRetrievalAgent', () => {
  jest.setTimeout(600000);
  const aiEmployeeRepo = new AIEmployeeRepository(process.env.USER_ID);

  let agent: GeneralAgent;
  let aiEmployee: IAIEmployee;

  beforeAll(async () => {
    await DatabaseHelper.connect(process.env.MONGO_URL);
    await mongoose.connection.set('bufferTimeoutMS', 100000);

    try {
      await aiEmployeeRepo.delete(process.env.DEMO_AIEMPLOYEE_ID);
    } catch (error) {
    }

    aiEmployee = await aiEmployeeRepo.create({
      _id: process.env.DEMO_AIEMPLOYEE_ID,
      name: 'Adam',
      role: 'Software Engineer',
      tools: [
        {
          id: 'sql-connector',
          options: {
            database: 'postgresql',
            host: '34.67.95.96',
            name: 'postgres',
            port: '5432',
            auth: {
              user: process.env.DB_USER,
              pass: process.env.DB_PASS,
            }
          }
        }
      ],
    }) as IAIEmployee

    agent = await new GeneralAgent(aiEmployee).init();
  });

  it('should grettings', async () => {
    const response = await agent.call(`Hello! My name is Linecker!`, [])
    console.log(response);
    expect(response.output).toContain('Hello')
  });

  it('should answer ai employee name', async () => {
    const response = await agent.call(`What is your name?`, [])
    console.log(response);
    expect(response.output).toContain('Adam')
  });

  it('should use memory to answer', async () => {
    const res = await agent.call(`Hello! My name is Linecker!`, [])
    console.log(res);

    const res2 = await agent.call(`What is my name?`, [])
    console.log(res2);
    expect(res2.output).toContain('Linecker')
  });

  // AI Employee Own Email
  it('should search on google', async () => {
    const res = await agent.call(`Qual é o nome da namorada do Neymar?
    `, [INTENTIONS.TASK_EXECUTION, INTENTIONS.INFORMATION_RETRIEVAL])
    console.log(res);
    expect(res.output).toContain('Bruna')
  });
  it('should send test email usign own email tool', async () => {
    const res = await agent.call(`Send test email to linecker@cognum.ai`, [])
    console.log(res);
    expect(res.output).toContain('sent')
  });
  it('should received emails by ai employee id and answer', async () => {

    // Find emails
    const mailService = new MailService(AIEmployeeTools.MailToolkitSettings)
    const mails = await mailService.find({
      to: aiEmployee.getEmail(),
      status: 'UNSEEN',
    })
    console.log(mails);

    // Answer emails
    for (const mail of mails) {
      const res = await agent.call(mail.text, [INTENTIONS.TASK_EXECUTION, INTENTIONS.INFORMATION_RETRIEVAL])
      console.log(res);

      await mailService.send({
        from: `${aiEmployee.name} (Cognum AI Employee) <${aiEmployee.getEmail()}>`,
        to: mail.from,
        subject: 'Re: ' + mail.subject,
        text: res.output,
      })
      console.log('Email sent');

      // Marcar email como lido
      console.log('Marking email as read');
      await mailService.markAsRead(mail.uid);
    }

    // const res = await agent.call(`Send test email to linecker@cognum.ai`, [])
    // console.log(res);
    expect(true).toBe(true)
  });

  it('should mark email as read', async () => {
    const mailService = new MailService(AIEmployeeTools.MailToolkitSettings)
    await mailService.markAsRead('<CAMdSuTG-wp4tczf=Fervnq+Yvc5v_BPoj9BKSyuahQ8iMKn54w@mail.gmail.com>');
  });

  // Demonstration use case
  it('should Get today sales report', async () => {
    const res = await agent.call(`Get today's sales report and send to linecker@cognum.ai`, [INTENTIONS.TASK_EXECUTION, INTENTIONS.INFORMATION_RETRIEVAL])
    console.log(res);
    expect(res.output).toContain('sent')
  });
  it('should execute a sequence of actions', async () => {
    const res = await agent.call(`Search for the latest news from around the world and send the results to linecker@cognum.ai`, [INTENTIONS.TASK_EXECUTION, INTENTIONS.INFORMATION_RETRIEVAL])
    console.log(res);
    expect(res.output).toContain('sent')
  });

  // Jobs
  it('should create a job with correct instructions', async () => {
    const aiEmployee = await aiEmployeeRepo.getById('6567a42c5c556abf1a8b9058')
    const agent = await new GeneralAgent(aiEmployee).init();

    try {
      const user = await new RepositoryHelper(User).getById(process.env.USER_ID)
      agent.context.user = user;
    } catch (error) {
      throw new Error('User not found');
    }

    // const result = await executor.call({ input: 'Send sales report for me every day at 7am' });
    const result = await agent.call('Send sales report to linecker@cognum.ai every minute');
    console.log(result.output);
    expect(result.output).toContain('55');
  })

  afterAll(async () => {
    // console.log('MEMORY', JSON.stringify(aiEmployee.memory));
    await aiEmployeeRepo.delete(aiEmployee._id);
    await mongoose.connection.close();
  });

});

