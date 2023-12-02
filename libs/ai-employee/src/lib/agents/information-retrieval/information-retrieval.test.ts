import { DatabaseHelper } from '@cognum/helpers';
import { IAIEmployee } from '@cognum/interfaces';
import 'dotenv/config';
import mongoose from 'mongoose';
import { AIEmployeeRepository } from '../../repositories';
import { INTENTIONS } from '../../utils/intent-classifier/intent-classifier.util';
import { InformationRetrievalAgent } from './information-retrieval.agent';

describe('InformationRetrievalAgent', () => {
  jest.setTimeout(600000);
  const aiEmployeeRepo = new AIEmployeeRepository(process.env.USER_ID);

  let agent: InformationRetrievalAgent;
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

    agent = await new InformationRetrievalAgent(aiEmployee).init();
  });

  it('should answer question correctly about email', async () => {
    const response = await agent.call(`What is Linecker's email?`, INTENTIONS.INFORMATION_RETRIEVAL)
    console.log(response);
    expect(response.output).toContain('linecker@cognum.ai')
  });

  it('should answer question usign web search', async () => {
    const response = await agent.call(`Qual é o nome da namorada do Neymar?`, INTENTIONS.INFORMATION_RETRIEVAL)
    console.log(response);
    expect(response.output).toContain('Bruna')
  });

  afterAll(async () => {
    await aiEmployeeRepo.delete(aiEmployee._id);
    await mongoose.connection.close();
  });

});

