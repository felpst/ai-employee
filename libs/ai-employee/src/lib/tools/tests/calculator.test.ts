import { DatabaseHelper } from '@cognum/helpers';
import { IAIEmployee } from '@cognum/interfaces';
import 'dotenv/config';
import mongoose from 'mongoose';
import { AIEmployeeRepository } from '../../repositories';

describe('InformationRetrievalaiEmployee', () => {
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

  it('should answer question correctly using tool calculator', async () => {
    const response = await aiEmployee.call(`How much is 50 + 9?`)
    console.log(response);
    expect(response.output).toContain('59')
  });

  afterAll(async () => {
    await aiEmployeeRepo.delete(aiEmployee._id);
    await mongoose.connection.close();
  });

});

