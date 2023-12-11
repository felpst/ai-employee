import { DatabaseHelper } from '@cognum/helpers';
import { IAIEmployee } from '@cognum/interfaces';
import 'dotenv/config';
import mongoose from 'mongoose';
import { AIEmployeeRepository } from '../../repositories';

describe('AI Employee: LinkedIn Lead Extractor Tool', () => {
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
          id: 'linkedin-lead-scraper',
          options: {
            user: process.env.LINKEDIN_USERNAME,
            password: process.env.LINKEDIN_PASSWORD
          }
        }
      ]
    }) as IAIEmployee
  });

  it('should use tool correctly', async () => {
    const response = await aiEmployee.call(`Get 5 leads: Web Designer in Brazil`)
    console.log(response);
    expect(response.output).toContain('5')
  });

  afterAll(async () => {
    await aiEmployeeRepo.delete(aiEmployee._id);
    await mongoose.connection.close();
  });

});

