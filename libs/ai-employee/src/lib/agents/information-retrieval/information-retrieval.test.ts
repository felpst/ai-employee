import { DatabaseHelper, RepositoryHelper } from '@cognum/helpers';
import { IAIEmployee, IWorkspace } from '@cognum/interfaces';
import { Workspace } from '@cognum/models';
import 'dotenv/config';
import mongoose from 'mongoose';
import OpenAI from 'openai';
import { AIEmployeeRepository } from '../../repositories';

describe('InformationRetrievalAgent', () => {
  jest.setTimeout(600000);
  const aiEmployeeRepo = new AIEmployeeRepository(process.env.USER_ID);
  const workspaceRepo = new RepositoryHelper(Workspace, process.env.USER_ID);
  const openai = new OpenAI();

  let aiEmployee: IAIEmployee;
  let workspace: IWorkspace;
  let openaiAssistant: OpenAI.Beta.Assistants.Assistant;

  beforeAll(async () => {
    await DatabaseHelper.connect(process.env.MONGO_URL);
    await mongoose.connection.set('bufferTimeoutMS', 100000);

    openaiAssistant = await openai.beta.assistants.create({
      model: "gpt-4-1106-preview"
    });

    workspace = await workspaceRepo.create({
      name: 'cognum testing team',
      users: [{
        user: process.env.USER_ID,
        permission: 'Employee'
      }],
      openaiAssistantId: openaiAssistant.id
    }) as IWorkspace;

    aiEmployee = await aiEmployeeRepo.create({
      name: 'Adam',
      role: 'Software Engineer',
      workspace: workspace._id,
      memory: [
        {
          pageContent: 'Linecker nasceu em Curitiba dia 10/10/1992, seu principal contato é linecker@cognum.ai'
        }
      ]
    }) as IAIEmployee
  });

  it('should answer question correctly about email', async () => {
    const call = await aiEmployee.call({
      input: `What is Linecker's email?`,
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

    expect(call.output).toContain('linecker@cognum.ai')
  });

  it('should answer question correctly using browser', async () => {
    const call = await aiEmployee.call({
      input: `What is Linecker Amorim's current job?`,
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

    expect(call.output).toContain('CTO')
  });

  // it('should answer question correctly about email', async () => {
  //   const response = await agent.call(`What is Linecker's email?`, INTENTIONS.INFORMATION_RETRIEVAL)
  //   console.log(response);
  //   expect(response.output).toContain('linecker@cognum.ai')
  // });

  // it('should answer question usign web search', async () => {
  //   const response = await agent.call(`Qual é o nome da namorada do Neymar?`, INTENTIONS.INFORMATION_RETRIEVAL)
  //   console.log(response);
  //   expect(response.output).toContain('Bruna')
  // });

  afterAll(async () => {
    await aiEmployeeRepo.delete(aiEmployee._id);
    await mongoose.connection.close();
  });

});

