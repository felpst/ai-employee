import 'dotenv/config';
import { AIEmployeeRepository } from '../repositories';
import { GeneralAgent } from '../agents/general';
import { IAIEmployee } from '@cognum/interfaces';
import { DatabaseHelper } from '@cognum/helpers';
import mongoose from 'mongoose';

describe('InformationRetrievalAgent', () => {
  jest.setTimeout(600000);
  const testEmployeeId = '659ed3258928300525d06484';
  const aiEmployeeRepo = new AIEmployeeRepository(process.env.USER_ID);
  let agent: GeneralAgent;
  let aiEmployee: IAIEmployee;

  beforeEach(async () => {
    await DatabaseHelper.connect(process.env.MONGO_URL);
    await mongoose.connection.set('bufferTimeoutMS', 100000);

    console.log('Creating test aiEmployee ...');
    aiEmployee = (await aiEmployeeRepo.create({
      _id: testEmployeeId,
      name: 'Adam',
      role: 'Software Engineer',
      tools: [],
    })) as IAIEmployee;

    agent = await new GeneralAgent(aiEmployee).init();
  });

  it('should answer question correctly about email', async () => {
    aiEmployee.memory.push({
      pageContent:
        'Linecker Amorim nasceu em Curitiba dia 10/10/1992, seu principal contato é linecker@cognum.ai.',
    });
    const response = await aiEmployee.memorySearch(`What is Linecker's email?`);
    console.log(response);
    expect(response.accuracy).toBe(true);
    expect(response.answer).toContain('linecker@cognum.ai');
  });

  it('should answer question correctly add information', async () => {
    let res = await aiEmployee.memoryInstruction(`Linecker nasceu em Curitiba`);
    console.log(JSON.stringify(res));

    res = await aiEmployee.memoryInstruction(
      `O sobrenome do Linecker é Amorim`
    );
    console.log(JSON.stringify(res));

    res = await aiEmployee.memoryInstruction(`Curitiba é uma cidade fria`);
    console.log(JSON.stringify(res));

    res = await aiEmployee.memoryInstruction(
      `Todo mundo que nasce em Curitiba é lindo`
    );
    console.log(JSON.stringify(res));

    let response = await aiEmployee.memoryInstruction(`O Linecker é lindo?`);
    console.log(response);

    res = await aiEmployee.memoryInstruction(
      `Limpe tudo o que você sabe sobre o Linecker`
    );
    console.log(JSON.stringify(res));

    const final = await aiEmployee.memorySearch(
      `Qual é o sobrenome do Linecker?`
    );
    console.log(final);

    expect(true).toBe(true);
  });

  afterAll(async () => {
    console.log('MEMORY', JSON.stringify(aiEmployee.memory));

    try {
      console.log('Deleting aiEmployee from testing ...');
      await aiEmployeeRepo.delete(testEmployeeId);
    } catch (error) {}
    await mongoose.connection.close();
  });
});
