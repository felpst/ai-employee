import { DatabaseHelper, RepositoryHelper } from '@cognum/helpers';
import { User } from '@cognum/models';
import 'dotenv/config';
import mongoose from 'mongoose';
import { agentTest } from '../../../tests/agent-test';

describe('JobCreateTool Test', () => {
  jest.setTimeout(600000)

  let executor = null;
  let jobService = null;

  beforeAll(async () => {
    await DatabaseHelper.connect(process.env.MONGO_URL);
    await mongoose.connection.set('bufferTimeoutMS', 100000);

    const user = await new RepositoryHelper(User).getById(process.env.USER_ID)
    console.log(user);
    const tools = jobService.toolkit();
    executor = await agentTest(tools, true);
  });

  it('should create a job with correct instructions', async () => {
    // const result = await executor.call({ input: 'Send sales report for me every day at 7am' });
    const result = await executor.call({ input: 'Send sales report to linecker@cognum.ai every minute' });
    console.log(result.output);
    expect(result.output).toContain('55');
  })

  afterAll(async () => {
    await mongoose.connection.close();
  });
})
