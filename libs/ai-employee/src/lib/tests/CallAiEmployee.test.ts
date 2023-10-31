import { IChat, IUser } from '@cognum/interfaces';
import { ChatModel } from '@cognum/llm';
import { AIEmployeeMemory } from '@cognum/tools';
import { AiEmployee } from '../entities/AiEmployee';
import { CallAiEmployee } from '../usecases/CallAiEmployee';

describe('CallAiEmployee', () => {
  jest.setTimeout(14000)

  const _user = {
    _id: "65414590ceef6a70882f026a",
    name: 'VENILTON',
    email: 'venilton@cognum.ai',
    password: '$2b$10$xxkBKIpQyxdDGwXnyQGacu5YqrlwIsL96rRX0uqhpORZOwR721xXe',
    createdAt: new Date('2023-10-30T21:24:12.953Z'),
    updatedAt: new Date('2023-10-30T21:24:12.956Z'),
    __v: 0
  }

  const _chat = {
    _id: "65413715ceef6a70882f025c",
    name: 'TesteArquiteturaAiEmployee',
    workspace: { _id: "6541461fceef6a70882f026d"},
    createdAt: new Date('2023-10-04T13:05:29.654+00:00'),
    updatedAt: new Date('2023-10-04T13:05:29.654+00:00'),
    createdBy: "65414590ceef6a70882f026a",
    updatedBy: "65414590ceef6a70882f026a",
    __v: 0
  }

  const aiEmployee = new AiEmployee(
    {
      profile: { _id: "654146e6ceef6a70882f0276", name: 'John', profession: 'Developer'},
      _model: new ChatModel(),
      memory: new AIEmployeeMemory({
        chat: _chat as unknown as IChat,
        user: _user as IUser
      })
    }
  )

  const usecasse = new CallAiEmployee(aiEmployee)

  it('should call ai employee', async () => {
    const result = usecasse.execute('What is your name?')
    console.log('result', result) 

    expect((await result).content).toContain('John')
  })
})
