import { DatabaseHelper } from '@cognum/helpers';
import { IAIEmployee } from '@cognum/interfaces';
import 'dotenv/config';
import mongoose from 'mongoose';
import { AgentTools } from '../../../agents/agent-tools/agent-tools.agent';
import { AIEmployeeRepository } from '../../../repositories';
import { AIEmployeeCall } from '../../../use-cases/ai-employee-call.usecase';

describe('Agent Tools', () => {
  jest.setTimeout(60000)

  const repository = new AIEmployeeRepository(process.env.USER_ID);
  let aiEmployee: IAIEmployee;
  let useCase: AIEmployeeCall;

  beforeAll(async () => {
    await DatabaseHelper.connect();
    await mongoose.connection.set('bufferTimeoutMS', 60000)

    aiEmployee = await repository.create({
      name: 'Adam',
      role: 'Software Engineer',
      tools: ['calculator', 'random-number-generator', 'mail-sender'],
    }) as IAIEmployee

    const agent = await new AgentTools(aiEmployee).init();
    useCase = new AIEmployeeCall(agent);
  })

  it('should return a successful response usign calculator as single input tool', async () => {
    const response = await useCase.execute('How much is 50 + 30 + 7?');
    expect(response).toContain('87');
  });

  it('should return a successful response usign random number and calculator as multi input tool', async () => {
    const response = await useCase.execute('What is a random number between 5 and 10 raised to the second power?');
    expect(response).toContain('5 and 10');
  });

  it('Generate a random number between 5 and 10 and raise it to the second power', async () => {
    const response = await useCase.execute('Generate a random number between 5 and 10 and raise it to the second power');
    expect(response).toContain('5 and 10');
  });

  it('should return a successful response usign mail sender tool', async () => {
    const response = await useCase.execute('Send email to lineckeramorim@gmail.com with inviting to dinner tomorrow.');
    expect(response).toContain('email has been sent');
  });

  it('should return a response of dont have a tool to execute', async () => {
    const response = await useCase.execute('How is Linecker Amorim?');
    expect(response).toBe('NOT_POSSIBLE_TO_EXECUTE_THIS_ACTION')
  });

  afterAll(async () => {
    await repository.delete(aiEmployee._id)
    await mongoose.connection.close();
  });
});
