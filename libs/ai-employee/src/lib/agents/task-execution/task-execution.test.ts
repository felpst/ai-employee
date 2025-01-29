import { DatabaseHelper } from '@cognum/helpers';
import { IAIEmployee } from '@cognum/interfaces';
import 'dotenv/config';
import mongoose from 'mongoose';
import { AIEmployeeRepository } from '../../repositories';
import { INTENTIONS } from '../../utils/intent-classifier/intent-classifier.util';
import { TaskExecutionAgent } from './task-execution.agent';

describe('TaskExecutionAgent', () => {
  jest.setTimeout(600000);
  const aiEmployeeRepo = new AIEmployeeRepository(process.env.USER_ID);

  let agent: TaskExecutionAgent;
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

    agent = await new TaskExecutionAgent(aiEmployee).init();
  });

  it('should answer question correctly using calculator', async () => {
    const response = await agent.call(`50 + 9`, INTENTIONS.TASK_EXECUTION)
    console.log(response);
    expect(response.output).toContain('59')
  });

  it('should answer question usign web search', async () => {
    const response = await agent.call(`Qual é o nome da namorada do Neymar?`, INTENTIONS.TASK_EXECUTION)
    console.log(response);
    expect(response.output).toContain('Bruna')
  });

  afterAll(async () => {
    await aiEmployeeRepo.delete(aiEmployee._id);
    await mongoose.connection.close();
  });

});

