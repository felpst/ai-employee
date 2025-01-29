import 'dotenv/config';
import { agentTest } from '../../tests/agent-test';
import { CSVAssistant } from '.';
import { DatabaseHelper, RepositoryHelper } from '@cognum/helpers';
import { Knowledge } from '@cognum/models';
import { AgentExecutor } from 'langchain/agents';
import mongoose from 'mongoose';
import { IKnowledge, KnowledgeTypeEnum } from '@cognum/interfaces';

describe('CSV Assistant tool test', () => {
  jest.setTimeout(300000);
  let executor: AgentExecutor;

  const knowledgeRepo = new RepositoryHelper(Knowledge, process.env.USER_ID);
  let knowledge;
  beforeAll(async () => {
    await DatabaseHelper.connect(process.env.MONGO_URL);
    await mongoose.connection.set('bufferTimeoutMS', 100000);

    knowledge = await knowledgeRepo.create({
      workspace: '65255213e481838d92a3864e' as any,
      title: 'inventory',
      contentUrl: 'https://storage.googleapis.com/cognum-data-sources/knowledges/6580e4b775824e5692d732a1/inventory-data.csv',
      description: 'inventory data',
      type: KnowledgeTypeEnum.File,
      openaiFileId: 'none'
    });

    const tools = [
      new CSVAssistant({ workspaceId: '65255213e481838d92a3864e' }),
    ];
    executor = await agentTest(tools, true);
  });

  it('should get number of lines in the file', async () => {
    const result = await executor.call({ input: 'How many different products in inventory-data.csv?' });
    console.log(result.output);
    expect(result.output).toContain('50');
  });

  afterAll(async () => {
    await knowledgeRepo.delete(knowledge._id);
  });
});
