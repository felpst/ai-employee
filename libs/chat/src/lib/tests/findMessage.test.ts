import { InMemoryChatRoomRepository } from "../repositories/InMemoryChatRoomRepository";
import { InMemoryMessageRepository } from "../repositories/InMemoryMessageRepository";
import { FindMessage } from "../usercases/findMessage";

describe('FindChatRoom', () => {
  const chatRoomRepository = new InMemoryChatRoomRepository();
  const messageRepository = new InMemoryMessageRepository();
  const findMessage = new FindMessage(messageRepository);

  let chatId: string
  let anotherChatId: string
  let messageId: string

  beforeAll(async () => {
    const chat1 = await chatRoomRepository.create({
      id: '1',
      name: 'Chat Room 1',
      workspace: 'Workspace 1'
    })

    chatId = chat1.id.toString()

    const chat2 = await chatRoomRepository.create({
      id: '2',
      name: 'Chat Room 2',
      workspace: 'Workspace 1'
    })

    anotherChatId = chat2.id.toString()

    const message1 = await messageRepository.create({
      content: 'Hello',
      senderId: '1',
      chatRoomId: chatId,
      timestamp: new Date()
    })

    messageId = message1.id.toString()

    await messageRepository.create({
      content: 'Hello',
      senderId: '1',
      chatRoomId: chatId,
      timestamp: new Date()
    })

    await messageRepository.create({
      content: 'Hello',
      senderId: '1',
      chatRoomId: anotherChatId,
      timestamp: new Date()
    })
  })
  
  it('should find a chat room by id', async () => {
    const chat = await findMessage.byId(messageId)

    expect(chat.id).toBeDefined();
    expect(chat.content).toBe('Hello');
    expect(chat.senderId).toBe('1');
    expect(chat.chatRoomId).toBe('1');
  })

  it('should find an messages by chat id', async () => {
    const chat = await findMessage.byChatRoomId(chatId)

    expect(chat.length).toBe(2)
  })

  it('should find all messages', async () => {
    const chat = await findMessage.all()

    expect(chat.length).not.toBe(0)
    
  })
})