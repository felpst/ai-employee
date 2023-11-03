import { DatabaseHelper } from '@cognum/helpers';
import { IChat, IUser } from '@cognum/interfaces';
import { ChatModel } from '@cognum/llm';
import { Chat, User } from '@cognum/models';
import { AIEmployeeMemory } from '@cognum/tools';
import mongoose from 'mongoose';
import { AiEmployee } from '../entities/AiEmployee';
import { CallAiEmployee } from '../usecases/CallAiEmployee';

describe('CallAiEmployee', () => {
  jest.setTimeout(60000)

  let _user: IUser
  let _chat: IChat
  let _memory: AIEmployeeMemory

  beforeAll(async () => {
    await DatabaseHelper.connect();
    
    mongoose.connection.set('bufferTimeoutMS', 60000);

    _user = await User.findById('65401efc97740ada74d29cb4')
    _chat = await Chat.findById('65413715ceef6a70882f025c')
    _memory = new AIEmployeeMemory({
      chat: _chat,
      user: _user
    })

    console.log('user', _user)
    console.log('chat', _chat)
    console.log('memory', _memory)
  });
  
  afterAll(async () => {
    await DatabaseHelper.disconnect();
  });
  
/*
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
    createdBy: "65414590ceef6a70882f026a",
    updatedBy: "65414590ceef6a70882f026a",
    __v: 0
  }
  */

  it('should call ai employee', async () => {

    console.log('memory_', _memory)

    const aiEmployee = new AiEmployee(
      {
        profile: { name: 'John', profession: 'Developer'},
        _model: new ChatModel({ verbose: true }),
        memory: _memory
      }
    )
    console.log('aiEmployee', aiEmployee)

    const usecasse = new CallAiEmployee(aiEmployee)

    const result = await usecasse.execute('What is your name?')

    console.log('result', result) 

    expect(result.content).toContain('John')
  })
})
