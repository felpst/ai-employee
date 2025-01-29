import { InMemoryChatRoomRepository } from "../repositories/InMemoryChatRoomRepository";
import { InMemoryMessageRepository } from "../repositories/InMemoryMessageRepository";
import { SendMessage } from "../usercases/sendMessage";

describe('SendMessage', () => {
  const messageRepository = new InMemoryMessageRepository();
  const chatRoomRepository = new InMemoryChatRoomRepository();
  
  let chatId: string

  beforeAll(async () => {
    const chat = await chatRoomRepository.create({
      id: '1',
      name: 'Chat Room 1',
      workspace: 'Workspace 1'
    })

    chatId = chat.id.toString()
  })

  it('should create a new message', async () => {
    const request = {
      content: 'Hello',
      senderId: '1',
      chatRoomId: chatId,
      timestamp: new Date()
    }

    const sendMessage = new SendMessage(messageRepository, chatRoomRepository);

    const message = await sendMessage.execute(request)

    expect(message.id).toBeDefined();
    expect(message.senderId).toBe(request.senderId);
    expect(message.chatRoomId).toBe(request.chatRoomId);
    expect(message.timestamp).toBe(request.timestamp);
  })  
})
