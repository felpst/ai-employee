import { DatabaseHelper } from '@cognum/helpers';
import { IAIEmployee } from '@cognum/interfaces';
import 'dotenv/config';
import mongoose from 'mongoose';
import { AIEmployeeRepository } from './repositories';

describe('InformationRetrievalaiEmployee', () => {
  jest.setTimeout(600000);
  const aiEmployeeRepo = new AIEmployeeRepository(process.env.USER_ID);
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

    // aiEmployee = await new AIEmployee(aiEmployee)
    // aiEmployee.context = ['chat', `user id: ${process.env.USER_ID}`]
  });

  it('should answer question correctly about email', async () => {
    const response = await aiEmployee.call(`What is Linecker's email?`)
    console.log(response);
    expect(response.output).toContain('linecker@cognum.ai')
  });

  it('should store new information in memory and answer correctly', async () => {
    const res = await aiEmployee.call(`Linecker's surname is Amorim`)
    console.log(res);

    const res2 = await aiEmployee.call(`What is the Linecker's surname?`)
    console.log(res2);

    expect(res2.output).toContain('Amorim')
  });

  it('should answer question usign web search', async () => {
    const res = await aiEmployee.call(`Qual é o nome da namorada do Neymar?`)
    console.log(res);

    const res2 = await aiEmployee.call(`Quantos anos a namorada do Neymar tem?`)
    console.log(res2);

    // Check if store informantion on web
    const res3 = await aiEmployee.call(`Quantos anos a namorada do Neymar tem?`)
    console.log(res3);

    expect(res.output).toBeDefined()
  });

  it('should answer question correctly using calculator', async () => {
    const response = await aiEmployee.call(`50 + 9`)
    console.log(response);
    expect(response.output).toContain('59')
  });

  it('should answer question correctly: What is the 10th fibonacci number?', async () => {
    const response = await aiEmployee.call(`What is the 10th fibonacci number?`)
    console.log(response);
    expect(response.output).toContain('10')
  });

  afterAll(async () => {
    console.log('MEMORY', JSON.stringify(aiEmployee.memory));

    await aiEmployeeRepo.delete(aiEmployee._id);
    await mongoose.connection.close();
  });

});

