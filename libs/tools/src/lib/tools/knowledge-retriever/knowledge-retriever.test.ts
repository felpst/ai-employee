import { DatabaseHelper, RepositoryHelper } from '@cognum/helpers';
import { IKnowledge, IWorkspace } from '@cognum/interfaces';
import { Knowledge, Workspace } from '@cognum/models';
import 'dotenv/config';
import * as fs from 'fs';
import { AgentExecutor } from 'langchain/agents';
import mongoose from 'mongoose';
import OpenAI from 'openai';
import { agentTest } from '../../tests/agent-test';
import { KnowledgeRetrieverToolSettings } from './knowledge-retriever.interfaces';
import { KnowledgeRetrieverTool } from './knowledge-retriever.tool';

describe('KnowledgeRetrieverTool test', () => {
  jest.setTimeout(300000)

  const workspaceRepo = new RepositoryHelper(Workspace, process.env.USER_ID);
  const knowledgeRepo = new RepositoryHelper(Knowledge, process.env.USER_ID);
  const openai = new OpenAI();

  let executor: AgentExecutor = null;
  let workspace: IWorkspace;
  let openaiAssistant: OpenAI.Beta.Assistants.Assistant;
  let knowledge: IKnowledge;
  let openaiFileId: string;

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

    knowledge = await knowledgeRepo.create({
      title: 'generic',
      description: 'generic knowledge document for storing the id of the file in openai. knowledge retriever will consider the file content only',
      workspace: workspace._id,
      data: 'not the real content',
      openaiFileId: 'file-7M2RpnKlosjlidEZqGZdnMOx'
    }) as IKnowledge;

    // Tools
    const settings: KnowledgeRetrieverToolSettings = {
      workspaceId: workspace._id
    }
    const tools = [
      new KnowledgeRetrieverTool(settings),
    ];

    // Agent test
    executor = await agentTest(tools);
  });

  afterAll(async () => {
    await workspaceRepo.delete(workspace._id);
    await knowledgeRepo.delete(knowledge._id);
    await openai.beta.assistants.del(openaiAssistant.id);

    await mongoose.connection.close();
  });

  it('should return a successful response usign knowledge retriever tool', async () => {
    await createOpenAIFile('cognum info', 'cognum is an AI tech startup');

    const response = await executor.call({ input: 'what information you have about cognum?' });
    expect(response.outputs).toContain("AI tech startup");

    await deleteOpenAIFile();
  });


  /** PRIVATE FUNCTIONS **/
  async function createOpenAIFile(fileName: string, data: string) {
    fileName += '.txt';
    fs.writeFileSync(`tmp/${fileName}`, data);
    const fileToUpload = fs.createReadStream(`tmp/${fileName}`);
    const uploaded = await openai.files.create({ file: fileToUpload, purpose: 'assistants' });

    openaiFileId = uploaded.id;
    knowledge = await knowledgeRepo.update(knowledge._id, { ...knowledge.toJSON(), openaiFileId });
  }

  async function deleteOpenAIFile() {
    await openai.files.del(openaiFileId);
    openaiFileId = undefined;
    knowledge = await knowledgeRepo.update(knowledge._id, { ...knowledge.toJSON(), openaiFileId: 'file-7M2RpnKlosjlidEZqGZdnMOx' });
  }

});
