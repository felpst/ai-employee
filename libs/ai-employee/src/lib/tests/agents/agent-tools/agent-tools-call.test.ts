import { DatabaseHelper } from '@cognum/helpers';
import { IAIEmployee } from '@cognum/interfaces';
import 'dotenv/config';
import mongoose from 'mongoose';
import { AgentTools } from '../../../agents/agent-tools/agent-tools.agent';
import { AIEmployeeRepository } from '../../../repositories';
import { AIEmployeeCall } from '../../../use-cases/ai-employee-call.usecase';

describe('Agent Tools', () => {
<<<<<<< HEAD
  jest.setTimeout(60000)
=======
  jest.setTimeout(600000)
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe

  const repository = new AIEmployeeRepository(process.env.USER_ID);
  let aiEmployee: IAIEmployee;
  let useCase: AIEmployeeCall;

  beforeAll(async () => {
<<<<<<< HEAD
    await DatabaseHelper.connect(process.env.MONGO_URL);
    await mongoose.connection.set('bufferTimeoutMS', 60000)
=======
    await DatabaseHelper.connect();
    await mongoose.connection.set('bufferTimeoutMS', 100000)
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe

    aiEmployee = await repository.create({
      name: 'Adam',
      role: 'Software Engineer',
<<<<<<< HEAD
      // tools: ['calculator', 'random-number-generator', 'mail-sender', 'serp-api'],
    }) as IAIEmployee

    const agent = await new AgentTools().init();
=======
      tools: ['calculator', 'random-number-generator', 'mail-sender', 'serp-api', 'python', 'sql'],
    }) as IAIEmployee

    const agent = await new AgentTools(aiEmployee).init();
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
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

<<<<<<< HEAD
=======
  it('should return a successful response usign python api tool', async () => {
    const response = await useCase.execute('What is the 10th fibonacci number?');
    expect(response).toContain('The 10th Fibonacci number is 34.');
  })

  it('should return a successful response usign sql api tool', async () => {
    const response = await useCase.execute('Connect to the database and say to me who are the top 3 best selling artists?');
    expect(response).toContain('Iron Maiden');
  })

>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
  it('should return a response of dont have a tool to execute', async () => {
    const response = await useCase.execute('How is Linecker Amorim?');
    expect(response).toBe('NOT_POSSIBLE_TO_EXECUTE_THIS_ACTION')
  });

  afterAll(async () => {
    await repository.delete(aiEmployee._id)
    await mongoose.connection.close();
  });
});
