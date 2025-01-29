import { DatabaseHelper } from '@cognum/helpers';
import { IAIEmployee } from '@cognum/interfaces';
import 'dotenv/config';
import mongoose from 'mongoose';
import { AIEmployeeRepository } from '../../repositories';

describe('BrowserAgent', () => {
  jest.setTimeout(600000);

  const aiEmployeeRepo = new AIEmployeeRepository(process.env.USER_ID);
  let aiEmployee: IAIEmployee;

  beforeAll(async () => {
    await DatabaseHelper.connect(process.env.MONGO_URL);
    await mongoose.connection.set('bufferTimeoutMS', 100000);

    aiEmployee = await aiEmployeeRepo.create({
      name: 'Adam',
      role: 'Software Engineer'
    }) as IAIEmployee
  });

  it('should answer question correctly about email', async () => {
    const call = await aiEmployee.call({
      input: `1. Login no Xandr
      Acesse a plataforma Xandr: https://invest.xandr.com/login
      Email: linecker@cognum.ai
      Senha: Cognum2023*`,
      user: process.env.USER_ID,
    })

    await new Promise((resolve) => {
      call.run().subscribe((call) => {
        console.log('[CALL UPDATED]', JSON.stringify(call));

        if (call.status === 'done') {
          console.log('DONE');
          resolve(call)
        }
      });
    });

    expect(call.output).toContain('https://invest.xandr.com/login')
  });

  afterAll(async () => {
    await aiEmployeeRepo.delete(aiEmployee._id);
    await mongoose.connection.close();
  });

});

