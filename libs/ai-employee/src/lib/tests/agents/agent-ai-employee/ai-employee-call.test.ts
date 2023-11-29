import { DatabaseHelper } from '@cognum/helpers';
import { IAIEmployee, IChatMessage } from '@cognum/interfaces';
import 'dotenv/config';
import mongoose from 'mongoose';
import { AgentAIEmployee } from '../../../agents/agent-ai-employee/agent-ai-employee.agent';
import { AIEmployeeRepository } from '../../../repositories';
import { AIEmployeeCall } from '../../../use-cases/ai-employee-call.usecase';

describe('aiEmployeeCall', () => {
<<<<<<< HEAD
  jest.setTimeout(300000)
=======
  jest.setTimeout(600000)
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe

  const repository = new AIEmployeeRepository(process.env.USER_ID);
  let aiEmployee: IAIEmployee;
  let agent: AgentAIEmployee;
  let useCase: AIEmployeeCall;

  beforeAll(async () => {
<<<<<<< HEAD
    await DatabaseHelper.connect(process.env.MONGO_URL);
=======
    await DatabaseHelper.connect();
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
    await mongoose.connection.set('bufferTimeoutMS', 60000)

    aiEmployee = await repository.create({
      name: 'Adam',
      role: 'Software Engineer',
<<<<<<< HEAD
      tools: ['calculator', 'random-number-generator', 'mail-sender', 'serp-api'],
=======
      tools: ['calculator', 'random-number-generator', 'mail-sender', 'serp-api', 'python', 'sql'],
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
    }) as IAIEmployee

    agent = await new AgentAIEmployee(aiEmployee).init();
    useCase = new AIEmployeeCall(agent);
  })

  it('should return a successful response of name', async () => {
    const response = await useCase.execute('What is your name?');
    // const response = await useCase.execute('Escreva um poema sobre ratos e gatos.');
    console.log(agent.processes);
<<<<<<< HEAD
    expect(response.output).toContain('Adam');
=======
    expect(response).toContain('Adam');
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
  });

  it('should return a successful response of role', async () => {
    const response = await useCase.execute('What is your role?');
<<<<<<< HEAD
    expect(response.output).toContain('Software Engineer');
=======
    expect(response).toContain('Software Engineer');
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
  });

  it('insert chat history', async () => {
    const chatHistory: Partial<IChatMessage>[] = [
      {
        content: 'Hello, my name is Linecker Amorim.',
        sender: 'linecker',
        role: 'user',
        chatRoom: 'test'
      },
      {
        content: 'Hello Linecker Amorim, how I can help you?',
        sender: 'Adam',
        role: 'bot',
        chatRoom: 'test'
      }
    ]

    const agent = await new AgentAIEmployee(aiEmployee, chatHistory).init();
    useCase = new AIEmployeeCall(agent);

    const response = await useCase.execute('What is my name?');
<<<<<<< HEAD
    expect(response.output).toContain('Linecker');
=======
    expect(response).toContain('Linecker');
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
  });

  it('test memory', async () => {
    await useCase.execute('Hello! My name is John.');
    const response = await useCase.execute('What is my name?');
<<<<<<< HEAD
    expect(response.output).toContain('John');
  });

  it('should return a successful response usign calculator as single input tool', async () => {
    const response = await useCase.execute('Using calculator tool. How much is 50 + 30 + 7?');
    console.log(response);
    console.log(JSON.stringify(agent.calls));
    expect(response.output).toContain('87');
=======
    expect(response).toContain('John');
  });

  it('should return a successful response usign calculator as single input tool', async () => {
    const response = await useCase.execute('How much is 50 + 30 + 7?');
    expect(response).toContain('87');
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
  });

  it('should return a successful response usign random number and calculator as multi input tool', async () => {
    const response = await useCase.execute('What is a random number between 5 and 10 raised to the second power?');
<<<<<<< HEAD
    console.log(response);
    console.log(JSON.stringify(agent.calls));
    expect(response.output).toContain('5 and 10');
=======
    expect(response).toContain('5 and 10');
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
  });

  it('should return a successful response usign mail sender tool', async () => {
    const response = await useCase.execute('Send email to lineckeramorim@gmail.com with inviting to dinner tomorrow.');
<<<<<<< HEAD
    expect(response.output).toContain('email has been sent');
=======
    expect(response).toContain('email has been sent');
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
  });

  it('create a article and send to email', async () => {
    const response = await useCase.execute('Create a ultimate article of how to be a good software engineer and send email to lineckeramorim@gmail.com.');
<<<<<<< HEAD
    expect(response.output).toContain('email has been sent');
  });

  it('should return a response of dont have a tool to execute', async () => {
    const response = await useCase.execute('How is Linecker Amorim?');
    console.log(response);
    expect(response.output).toBe('NOT_POSSIBLE_TO_EXECUTE_THIS_ACTION')
=======
    expect(response).toContain('email has been sent');
  });

  it('should return a successful response usign python api tool', async () => {
    const response = await useCase.execute('What is the 10th fibonacci number?');
    expect(response).toContain('55');
  })

  it('should return a successful response usign sql api tool', async () => {
    const response = await useCase.execute('Connect to the database and say to me who are the top 3 best selling artists?');
    expect(response).toContain('Iron Maiden');
  })

  it('should return a response of dont have a tool to execute', async () => {
    const response = await useCase.execute('How is Linecker Amorim?');
    console.log(response);
    expect(response).toBe('NOT_POSSIBLE_TO_EXECUTE_THIS_ACTION')
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
  });

  afterAll(async () => {
    await repository.delete(aiEmployee._id)
    await mongoose.connection.close();
  });
});
