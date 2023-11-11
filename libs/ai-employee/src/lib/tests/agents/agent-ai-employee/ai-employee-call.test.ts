import { DatabaseHelper } from '@cognum/helpers';
import { IAIEmployee, IChatMessage } from '@cognum/interfaces';
import 'dotenv/config';
import mongoose from 'mongoose';
import { AgentAIEmployee } from '../../../agents/agent-ai-employee/agent-ai-employee.agent';
import { AIEmployeeRepository } from '../../../repositories';
import { AIEmployeeCall } from '../../../use-cases/ai-employee-call.usecase';

describe('aiEmployeeCall', () => {
  jest.setTimeout(60000)

  const repository = new AIEmployeeRepository(process.env.USER_ID);
  let aiEmployee: IAIEmployee;
  let agent: AgentAIEmployee;
  let useCase: AIEmployeeCall;

  beforeAll(async () => {
    await DatabaseHelper.connect();
    await mongoose.connection.set('bufferTimeoutMS', 60000)

    aiEmployee = await repository.create({
      name: 'Adam',
      role: 'Software Engineer',
      tools: ['calculator', 'random-number-generator', 'mail-sender'],
    }) as IAIEmployee

    agent = await new AgentAIEmployee(aiEmployee).init();
    useCase = new AIEmployeeCall(agent);
  })

  it('should return a successful response of name', async () => {
    const response = await useCase.execute('What is your name?');
    // const response = await useCase.execute('Escreva um poema sobre ratos e gatos.');
    console.log(agent.processes);
    expect(response).toContain('Adam');
  });

  it('should return a successful response of role', async () => {
    const response = await useCase.execute('What is your role?');
    expect(response).toContain('Software Engineer');
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
    expect(response).toContain('Linecker');
  });

  it('test memory', async () => {
    await useCase.execute('Hello! My name is John.');
    const response = await useCase.execute('What is my name?');
    expect(response).toContain('John');
  });

  it('should return a successful response usign calculator as single input tool', async () => {
    const response = await useCase.execute('How much is 50 + 30 + 7?');
    expect(response).toContain('87');
  });

  it('should return a successful response usign random number and calculator as multi input tool', async () => {
    const response = await useCase.execute('What is a random number between 5 and 10 raised to the second power?');
    expect(response).toContain('5 and 10');
  });

  it('should return a successful response usign mail sender tool', async () => {
    const response = await useCase.execute('Send email to lineckeramorim@gmail.com with inviting to dinner tomorrow.');
    expect(response).toContain('email has been sent');
  });

  it('create a article and send to email', async () => {
    const response = await useCase.execute('Create a ultimate article of how to be a good software engineer and send email to lineckeramorim@gmail.com.');
    expect(response).toContain('email has been sent');
  });

  it('should return a response of dont have a tool to execute', async () => {
    const response = await useCase.execute('How is Linecker Amorim?');
    console.log(response);
    expect(response).toBe('NOT_POSSIBLE_TO_EXECUTE_THIS_ACTION')
  });

  afterAll(async () => {
    await repository.delete(aiEmployee._id)
    await mongoose.connection.close();
  });
});
