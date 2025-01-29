import { InMemoryChatRoomRepository } from "../repositories/InMemoryChatRoomRepository";
import { InMemoryMessageRepository } from "../repositories/InMemoryMessageRepository";
import { UpdateMessage } from "../usercases/updateMessage";

describe('UpdateMessage', () => {
  const messageRepository = new InMemoryMessageRepository();
  const chatRoomRepository = new InMemoryChatRoomRepository();

  let id: string

  beforeAll(async () => {
    await chatRoomRepository.create({
      id: '1',
      name: 'Chat Room 1',
      workspace: 'Workspace 1'
    })

    const message = await messageRepository.create({
      content: 'Hello',
      senderId: '1',
      chatRoomId: '1',
      timestamp: new Date()
    })

    id = message.id.toString()
  })

  it('should update a message', async () => {
    const content = 'any Content'

    const updateChatRoom = new UpdateMessage(messageRepository);

    const message = await updateChatRoom.execute(id ,content)


    expect(message.content).toBe(content);

  })  
})
