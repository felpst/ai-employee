import { DatabaseHelper } from '@cognum/helpers';
import { IAIEmployee } from '@cognum/interfaces';
import 'dotenv/config';
import mongoose from 'mongoose';
import { AIEmployee } from './ai-employee';
import { AIEmployeeRepository } from './repositories';

describe('InformationRetrievalAgent', () => {
  jest.setTimeout(600000);
  const aiEmployeeRepo = new AIEmployeeRepository(process.env.USER_ID);

  let agent: AIEmployee;
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
      memory: [
        {
          pageContent: 'Linecker nasceu em Curitiba dia 10/10/1992, seu principal contato é linecker@cognum.ai'
        }
      ]
    }) as IAIEmployee

    agent = await new AIEmployee(aiEmployee).init();
    agent.context = ['chat', `user id: ${process.env.USER_ID}`]
  });

  it('should answer question correctly about email', async () => {
    const response = await agent.call(`What is Linecker's email?`)
    console.log(response);
    expect(response.output).toContain('linecker@cognum.ai')
  });

  it('should store new information in memory and answer correctly', async () => {
    const res = await agent.call(`Linecker's surname is Amorim`)
    console.log(res);

    const res2 = await agent.call(`What is the Linecker's surname?`)
    console.log(res2);

    expect(res2.output).toContain('Amorim')
  });

  afterAll(async () => {
    console.log('MEMORY', JSON.stringify(aiEmployee.memory));

    await aiEmployeeRepo.delete(aiEmployee._id);
    await mongoose.connection.close();
  });

});

