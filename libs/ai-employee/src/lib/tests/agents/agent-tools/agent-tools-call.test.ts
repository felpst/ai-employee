import { DatabaseHelper, RepositoryHelper } from '@cognum/helpers';
import { IAIEmployee, IKnowledge, IWorkspace } from '@cognum/interfaces';
import { Knowledge, Workspace } from '@cognum/models';
import 'dotenv/config';
import * as fs from 'fs';
import mongoose from 'mongoose';
import OpenAI from 'openai';
import { AgentTools } from '../../../agents/agent-tools/agent-tools.agent';
import { AIEmployeeRepository } from '../../../repositories';
import { AIEmployeeCall } from '../../../use-cases/ai-employee-call.usecase';

describe('Agent Tools', () => {
  jest.setTimeout(600000);

  const aiEmployeeRepo = new AIEmployeeRepository(process.env.USER_ID);
  const workspaceRepo = new RepositoryHelper(Workspace, process.env.USER_ID);
  const knowledgeRepo = new RepositoryHelper(Knowledge, process.env.USER_ID);
  const openai = new OpenAI();

  let aiEmployee: IAIEmployee;
  let workspace: IWorkspace;
  let useCase: AIEmployeeCall;
  let openaiAssistant: OpenAI.Beta.Assistants.Assistant;
  let knowledge: IKnowledge;
  let openaiFileId: string;

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

  beforeAll(async () => {
    await DatabaseHelper.connect(process.env.MONGO_URL);
    await mongoose.connection.set('bufferTimeoutMS', 100000);

    openaiAssistant = await openai.beta.assistants.create({
      model: "gpt-4-1106-preview"
    });
    await mongoose.connection.set('bufferTimeoutMS', 60000)

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
      tools: [],
      workspace: workspace._id
    }) as IAIEmployee;

    knowledge = await knowledgeRepo.create({
      title: 'generic',
      description: 'generic knowledge document for storing the id of the file in openai. knowledge retriever will consider the file content only',
      workspace: workspace._id,
      data: 'not the real content',
      openaiFileId: 'file-7M2RpnKlosjlidEZqGZdnMOx'
    }) as IKnowledge;

    const agent = await new AgentTools(aiEmployee).init();
    useCase = new AIEmployeeCall(agent);
  });

  it('should return a successful response usign calculator as single input tool', async () => {
    const response = await useCase.execute('How much is 50 + 30 + 7?');
    expect(response).toContain('87');
  });

  it('should return a successful response usign random number and calculator as multi input tool', async () => {
    const response = await useCase.execute('What is a random number between 5 and 10 raised to the second power?');
    expect(response).toContain('5 and 10');
  });

  it('Generate a random number between 5 and 10 and raise it to the second power', async () => {
    const response = await useCase.execute('Generate a random number between 5 and 10 and raise it to the second power');
    expect(response).toContain('5 and 10');
  });

  it('should return a successful response usign mail sender tool', async () => {
    const response = await useCase.execute('Send email to lineckeramorim@gmail.com with inviting to dinner tomorrow.');
    expect(response).toContain('email has been sent');
  });

  it('should return a successful response usign python api tool', async () => {
    const response = await useCase.execute('What is the 10th fibonacci number?');
    expect(response).toContain('The 10th Fibonacci number is 34.');
  });

  it('should return a successful response usign sql api tool', async () => {
    const response = await useCase.execute('Connect to the database and say to me who are the top 3 best selling artists?');
    expect(response).toContain('Iron Maiden');
  });

  it('should return a response of dont have a tool to execute', async () => {
    const response = await useCase.execute('How is Linecker Amorim?');
    expect(response).toBe('NOT_POSSIBLE_TO_EXECUTE_THIS_ACTION');
  });

  it('should return a successful response using knowledge retriever tool', async () => {
    await createOpenAIFile('cognum info', 'cognum is an AI tech startup');

    const response = await useCase.execute('what you think that cognum is?');
    expect(response).toContain("AI tech startup");

    await deleteOpenAIFile();
  });

  it('should return unsuccessful response using knowledge retriever tool when information is not found', async () => {
    const response = await useCase.execute('what is cognum?');
    expect(response).toBe("NOT_POSSIBLE_TO_EXECUTE_THIS_ACTION");
  });

  afterAll(async () => {
    await workspaceRepo.delete(workspace._id);
    await aiEmployeeRepo.delete(aiEmployee._id);
    await knowledgeRepo.delete(knowledge._id);
    await openai.beta.assistants.del(openaiAssistant.id);

    await mongoose.connection.close();
  });
});
