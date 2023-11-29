import { DatabaseHelper, RepositoryHelper } from '@cognum/helpers';
import { IAIEmployee, IChatMessage, IKnowledge, IWorkspace } from '@cognum/interfaces';
import { Knowledge, Workspace } from '@cognum/models';
import 'dotenv/config';
import * as fs from 'fs';
import mongoose from 'mongoose';
import OpenAI from 'openai';
import { AgentAIEmployee } from '../../../agents/agent-ai-employee/agent-ai-employee.agent';
import { AIEmployeeRepository } from '../../../repositories';
import { AIEmployeeCall } from '../../../use-cases/ai-employee-call.usecase';

describe('aiEmployeeCall', () => {
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
  let agent: AgentAIEmployee;

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

    aiEmployee = await aiEmployeeRepo.create({
      name: 'Adam',
      role: 'Software Engineer',
      tools: [
        {
          id: 'calculator',
        }
      ],
    }) as IAIEmployee

    agent = await new AgentAIEmployee(aiEmployee).init();
    useCase = new AIEmployeeCall(agent);
  });

  it('should return a successful response of name', async () => {
    const response = await useCase.execute('What is your name?');
    // const response = await useCase.execute('Escreva um poema sobre ratos e gatos.');
    console.log(agent.processes);
    expect(response.output).toContain('Adam');
  });

  it('should return a successful response of role', async () => {
    const response = await useCase.execute('What is your role?');
    expect(response.output).toContain('Software Engineer');
  });

  it('insert chat history', async () => {
    const chatHistory: Partial<IChatMessage>[] = [
      {
        content: 'Hello, my name is Linecker Amorim.',
        sender: 'linecker',
        role: 'user',
        chatRoom: 'test'
      },
      {
        content: 'Hello Linecker Amorim, how I can help you?',
        sender: 'Adam',
        role: 'bot',
        chatRoom: 'test'
      }
    ];

    const agent = await new AgentAIEmployee(aiEmployee, chatHistory).init();
    useCase = new AIEmployeeCall(agent);

    const response = await useCase.execute('What is my name?');
    expect(response.output).toContain('Linecker');
  });

  it('test memory', async () => {
    await useCase.execute('Hello! My name is John.');
    const response = await useCase.execute('What is my name?');
    expect(response.output).toContain('John');
  });

  it('should return a successful response usign calculator as single input tool', async () => {
    const response = await useCase.execute('Using calculator tool. How much is 50 + 30 + 7?');
    console.log(response);
    console.log(JSON.stringify(agent.calls));
    expect(response.output).toContain('87');
  });

  it('should return a successful response usign random number and calculator as multi input tool', async () => {
    const response = await useCase.execute('What is a random number between 5 and 10 raised to the second power?');
    console.log(response);
    console.log(JSON.stringify(agent.calls));
    expect(response.output).toContain('5 and 10');
  });

  it('should return a successful response usign mail sender tool', async () => {
    const response = await useCase.execute('Send email to lineckeramorim@gmail.com with inviting to dinner tomorrow.');
    expect(response.output).toContain('email has been sent');
  });

  it('create a article and send to email', async () => {
    const response = await useCase.execute('Create a ultimate article of how to be a good software engineer and send email to lineckeramorim@gmail.com.');
    expect(response.output).toContain('email has been sent');
  });

  it('should return a successful response usign python api tool', async () => {
    const response = await useCase.execute('What is the 10th fibonacci number?');
    expect(response).toContain('55');
  });

  it('should return a successful response usign sql api tool', async () => {
    const response = await useCase.execute('Connect to the database and say to me who are the top 3 best selling artists?');
    expect(response).toContain('Iron Maiden');
  });

  it('should return a successful response usign knowledge retriever tool', async () => {
    await createOpenAIFile('cognum info', 'cognum is an AI tech startup');

    const response = await useCase.execute('what information you have about cognum?');
    expect(response).toContain("AI tech startup");

    await deleteOpenAIFile();
  });

  it('should return a response of dont have a tool to execute', async () => {
    const response = await useCase.execute('How is Linecker Amorim?');
    console.log(response);
    expect(response).toBe('NOT_POSSIBLE_TO_EXECUTE_THIS_ACTION');
    it('should return a response of dont have a tool to execute', async () => {
      const response = await useCase.execute('How is Linecker Amorim?');
      console.log(response);
      expect(response.output).toBe('NOT_POSSIBLE_TO_EXECUTE_THIS_ACTION')
    });

    afterAll(async () => {
      await workspaceRepo.delete(workspace._id);
      await aiEmployeeRepo.delete(aiEmployee._id);
      await knowledgeRepo.delete(knowledge._id);
      await openai.beta.assistants.del(openaiAssistant.id);

      await mongoose.connection.close();
    });
  });
});
