import { IChatRoom } from "../entities/ChatRoom";
import { InMemoryChatRoomRepository } from "../repositories/InMemoryChatRoomRepository";
import { DeleteChatRoom } from "../usercases/DeleteChatRoom";

describe('CreateChatRoom', () => {
  const chatRoomRepository = new InMemoryChatRoomRepository();

  let chat: IChatRoom

  beforeAll(async () => {
    chat = await chatRoomRepository.create({
      id: '1',
      name: 'Chat Room 1',
      workspace: 'Workspace 1'
    })
  })

  it('should create a new chat room', async () => {
    const deleteChatRoom = new DeleteChatRoom(chatRoomRepository);

    const chatRoom = deleteChatRoom.execute(chat.id.toString())

    await expect(() => chatRoom).not.toThrow()
  })  
})
