import { InMemoryChatRoomRepository } from "../repositories/InMemoryChatRoomRepository";
import { FindChatRoom } from "../usercases/FindChatRoom";

describe('FindChatRoom', () => {
  const chatRoomRepository = new InMemoryChatRoomRepository();
  const findChatRoom = new FindChatRoom(chatRoomRepository);

  let id: string

  beforeAll(async () => {
    const chat = await chatRoomRepository.create({
      id: Math.random().toString(36).substring(2, 9),
      name: 'Chat Room 1',
      workspace: 'Workspace 1'
    })

    id = chat.id.toString()

    await chatRoomRepository.create({
      id: Math.random().toString(36).substring(2, 9),
      name: 'Chat Room 2',
      workspace: 'Workspace 1'
    })

    await chatRoomRepository.create({
      id: Math.random().toString(36).substring(2, 9),
      name: 'Chat Room 3',
      workspace: 'Workspace 2'
    })
  })
  
  it('should find a chat room by id', async () => {
    const chat = await findChatRoom.byId(id)

    expect(chat.id).toBeDefined();
    expect(chat.name).toBe('Chat Room 1');
    expect(chat.workspace).toBe('Workspace 1');
  })

  it('should find a chat room by workspace', async () => {
    const chat = await findChatRoom.byWorkspace('Workspace 1')

    expect(chat.length).toBe(2)
  })

  it('should find all chat rooms', async () => {
    const chat = await findChatRoom.all()

    expect(chat.length).not.toBe(0)
    
  })
})