import { DatabaseHelper } from '@cognum/helpers';
import { IAIEmployee } from '@cognum/interfaces';
import 'dotenv/config';
import mongoose from 'mongoose';
import { AIEmployeeRepository } from '../../repositories';
import { ConfigurationAgent } from './configuration.agent';

describe('ConfigurationAgent', () => {
  jest.setTimeout(600000);
  const aiEmployeeRepo = new AIEmployeeRepository(process.env.USER_ID);

  let agent: ConfigurationAgent;
  let aiEmployee: IAIEmployee;

  beforeAll(async () => {
    await DatabaseHelper.connect(process.env.MONGO_URL);
    await mongoose.connection.set('bufferTimeoutMS', 100000);

    aiEmployee = await aiEmployeeRepo.create({
      name: 'Adam',
      role: 'Software Engineer',
      tools: [
        {
          id: 'calculator',
        }
      ],
    }) as IAIEmployee

    agent = await new ConfigurationAgent(aiEmployee).init();
  });

  it('should grettings', async () => {
    const response = await agent.call(`Hello! My name is Linecker!`)
    console.log(response);
    expect(response.output).toContain('Hello')
  });

  it('should answer ai employee name', async () => {
    const response = await agent.call(`What is your name?`)
    console.log(response);
    expect(response.output).toContain('Adam')
  });

  it('should use memory to answer', async () => {
    agent.context = ['chat', `user id: ${process.env.USER_ID}`]
    const res = await agent.call(`Hello! My name is Linecker!`)
    console.log(res);

    const res2 = await agent.call(`What is my name?`)
    console.log(res2);
    expect(res2.output).toContain('Linecker')
  });

  afterAll(async () => {
    console.log('MEMORY', JSON.stringify(aiEmployee.memory));

    await aiEmployeeRepo.delete(aiEmployee._id);
    await mongoose.connection.close();
  });

});

