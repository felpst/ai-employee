import { ChatRoom, IChatRoom } from '../entities/ChatRoom';
import { IChatRoomRepository } from './ChatRoomRepository';

export class InMemoryChatRoomRepository implements IChatRoomRepository {
  private chatRooms: IChatRoom[] = [];

  async create(data: Partial<IChatRoom>): Promise<IChatRoom> {

    const chatRoom = new ChatRoom(data);

    this.chatRooms.push(chatRoom);
    
    return Promise.resolve(chatRoom)
  }

  async findAll(): Promise<IChatRoom[]> {
    return Promise.resolve(this.chatRooms)
  }

  async findById(id: string): Promise<IChatRoom> {
    const chatRoom = this.chatRooms.find(u => u.id === id);
    return Promise.resolve(chatRoom);
  }

  async findByWorkspace(workspaceId: string): Promise<IChatRoom[]> {
    const chatRoom = this.chatRooms.filter(u => u.workspace.toString() === workspaceId);
    return Promise.resolve(chatRoom);
  }

  async update(id: string, data: Partial<IChatRoom>): Promise<IChatRoom> {
    const index = this.chatRooms.findIndex(u => u.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Chat not found'));
    }
    const updatedChat = { ...this.chatRooms[index], ...data };
    this.chatRooms[index] = updatedChat as ChatRoom;
    return Promise.resolve(updatedChat);
  }

  async delete(id: string): Promise<void> {
    const index = this.chatRooms.findIndex(u => u.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Chat not found'));
    }
    const deletedChat = this.chatRooms.splice(index, 1)[0];
    Promise.resolve(deletedChat);
  }
}
