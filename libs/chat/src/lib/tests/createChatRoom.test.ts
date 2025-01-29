import { InMemoryChatRoomRepository } from "../repositories/InMemoryChatRoomRepository";
import { CreateChatRoom } from "../usercases/CreateChatRoom";

describe('CreateChatRoom', () => {
  it('should create a new chat room', async () => {
    const request = {
      id: '1',
      name: 'Chat Room 1',
      workspace: 'Workspace 1'
    }

    const chatRoomRepository = new InMemoryChatRoomRepository();

    const createChatRoom = new CreateChatRoom(chatRoomRepository);

    const chatRoom = await createChatRoom.execute(request)

    expect(chatRoom.id).toBeDefined();
    expect(chatRoom.name).toBe(request.name);
    expect(chatRoom.workspace).toBe(request.workspace);
  })  
})
