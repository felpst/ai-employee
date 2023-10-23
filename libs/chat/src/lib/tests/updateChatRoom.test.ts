import { InMemoryChatRoomRepository } from "../repositories/InMemoryChatRoomRepository";
import { UpdateChatRoom } from "../usercases/UpdateChatRoom";

describe('UpdateChatRoom', () => {
  const chatRoomRepository = new InMemoryChatRoomRepository();

  beforeAll(async () => {
    await chatRoomRepository.create({
      id: '1',
      name: 'Chat Room 1',
      workspace: 'Workspace 1'
    })
  })

  it('should create a new chat room', async () => {
    const request = {
      name: 'Chat Room 2',
      workspace: 'Workspace 2'
    }


    const createChatRoom = new UpdateChatRoom(chatRoomRepository);

    const chatRoom = await createChatRoom.execute('1' ,request)

    expect(chatRoom.id).toBeDefined();
    expect(chatRoom.name).toBe('Chat Room 2');
    expect(chatRoom.workspace).toBe('Workspace 2');
  })  
})
