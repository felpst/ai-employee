import 'dotenv/config';
import { BrowserAgent } from "../lib/browser";
import { DatabaseHelper } from '@cognum/helpers';
import mongoose, { Model, Schema } from 'mongoose';
import { XandrSteps, LinkedinSteps } from './mock/raw-steps';

let skillModel: Model<any>;
beforeAll(async () => {
  await DatabaseHelper.connect(process.env.MONGO_URL);
  const SkillSchema = new Schema({}, { strict: false });
  skillModel = mongoose.model('Skill', SkillSchema, 'skills');
});
afterAll(async () => {
  await DatabaseHelper.disconnect();
});

describe('Skill Learning test', () => {
  jest.setTimeout(600000);

  test('Should learn Xandr Login', async () => {
    const browserAgent = new BrowserAgent([], '');
    await browserAgent.seed();


    const countBefore = await skillModel.count();
    try {
      const result = await browserAgent.learnerAgent.invoke({
        task: 'login to xandr',
        steps: XandrSteps.login
      });

      console.log(result);
    } catch (error) {
      console.error(error);
    }
    const countAfter = await skillModel.count();

    expect(countAfter).toBe(countBefore + 1);
  });

  test('Should learn Linkedin Lead Extraction and make a loop for repeating actions', async () => {
    const browserAgent = new BrowserAgent([], '');
    await browserAgent.seed();


    const countBefore = await skillModel.count();
    try {
      const result = await browserAgent.learnerAgent.invoke({
        task: 'Extract Software Engineers from linkedin until the third page',
        steps: LinkedinSteps.extractLeads
      });

      console.log(result);
    } catch (error) {
      console.error(error);
    }
    const countAfter = await skillModel.count();

    expect(countAfter).toBe(countBefore + 1);
  });
});
