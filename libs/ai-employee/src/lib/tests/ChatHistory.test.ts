import { IChat, IUser } from '@cognum/interfaces';
import { ChatModel } from '@cognum/llm';
import { AIEmployeeMemory } from '@cognum/tools';
import { AiEmployee } from '../entities/AiEmployee';
import { ChatHistory } from '../usecases/ChatHistory';

describe('ChatMemory', () => {
  jest.setTimeout(14000)

  const _user = {
    _id: "65401efc97740ada74d29cb4",
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
    workspace: { _id: "65401f1997740ada74d29cbb"},
    createdAt: new Date('2023-10-04T13:05:29.654+00:00'),
    updatedAt: new Date('2023-10-04T13:05:29.654+00:00'),
    createdBy: "65401efc97740ada74d29cb4",
    updatedBy: "65401efc97740ada74d29cb4",
    __v: 0
  }

  const aiEmployee = new AiEmployee(
    {
      profile: {name: 'John', profession: 'Developer'},
      _model: new ChatModel(),
      memory: new AIEmployeeMemory({
        chat: _chat as unknown as IChat,
        user: _user as IUser
      })
    }
  )

  const usecasse = new ChatHistory(aiEmployee)

  it('should get Chat History', async () => {
    const result = await usecasse.execute()
    console.log('result', result)

    expect(result.length).toBeGreaterThan(0)
    expect(result.length).toBeLessThanOrEqual(10)
  })
})
