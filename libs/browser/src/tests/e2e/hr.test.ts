import 'dotenv/config';
import { IAIEmployee } from '@cognum/interfaces';
import { BrowserAgent } from '../../lib/browser';
import { DatabaseHelper } from '@cognum/helpers';
import mongoose, { Model, Schema } from 'mongoose';
import { Skill } from '../../lib/browser.interfaces';
import { readFileSync, writeFileSync } from 'fs';

describe('HR System e2e', () => {
  console.warn = jest.fn();
  jest.setTimeout(600000);

  const memory = `
    HR-Sys:
    - Link: https://hr-system.ahmeddeghady.com/
    - Email: 'super@root.com'
    - Password: 'password'
    `;

  const browserAgent = new BrowserAgent([], memory, { _id: 'testaiemployee' } as IAIEmployee);

  let skillModel: Model<any>;
  beforeAll(async () => {
    await browserAgent.seed();
    await DatabaseHelper.connect(process.env.MONGO_URL);
    const SkillSchema = new Schema({}, { strict: false });
    skillModel = mongoose.model('Skill', SkillSchema, 'skills');
  });
  afterAll(async () => {
    await DatabaseHelper.disconnect();
  });

  test('Create a new branch', async () => {
    const task = `On HR-Sys, create a new organization branch:
    Branch Name: Alexandria Branch
    Branch Address: 125 Nile Street, Apartment 201, West Alexandria, VA 22301
    Department Phone: 7035551234
    Department Email: manager.alexandria@example.com
    Manager: Trey Hills`;

    const realTask = `On HR-Sys, create a new organization branch:
    Branch Name: Scranton Branch
    Branch Address: 1725 Slough Avenue in Scranton, PA
    Department Phone: 717 555 0177
    Department Email: michael.scott@dundermifflin.com
    Manager: Michael Scott`;

    console.log('STARTING ADAPTATION');
    const adaptationResult = await browserAgent.adaptatorAgent.invoke({
      input: task
    });

    await browserAgent.webBrowser.close();

    console.log('ENDING ADAPTATION');
    console.log('STARTING LEARNING');

    await browserAgent.learnerAgent.invoke({
      task,
      steps: adaptationResult.intermediateSteps
    });

    console.log('ENDING LEARNING');

    const skillList = (await skillModel.find())
      .map(doc => doc.skill);

    console.log('STARTING SKILL BASED EXECUTION');

    const newAgent = new BrowserAgent(skillList, memory);
    await newAgent.seed();
    await newAgent.executorAgent.invoke({ input: realTask });

    await newAgent.webBrowser.close();
    expect(true).toBe(true);
  });
});
