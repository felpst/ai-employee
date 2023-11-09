import { InMemoryChatRoomRepository } from "../repositories/InMemoryChatRoomRepository";
import { InMemoryMessageRepository } from "../repositories/InMemoryMessageRepository";
import { DeleteMessage } from "../usercases/deleteMessage";

describe('DeleteMessage', () => {
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
    const updateChatRoom = new DeleteMessage(messageRepository);

    const message = updateChatRoom.execute(id)


    await expect(() => message).not.toThrow()

  })  
})
