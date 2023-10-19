import { ChatRoom, IChatRoom } from '../entities/ChatRoom';
import { IChatRoomDocument, IChatRoomRepository } from './ChatRoomRepository';

export class InMemoryUserRepository implements IChatRoomRepository {
  private chatRooms: IChatRoomDocument[] = [];

  async create(data: Partial<IChatRoom>): Promise<IChatRoomDocument> {

    const chatRoom = new ChatRoom(data);
    const document = new Document()
    
    return Promise.resolve (Object.assign(chatRoom, ...Document))
  }

  async findAll(): Promise<IChatRoomDocument[]> {
    return await this.chatRooms.find();
  }

  async findById(id: string): Promise<IChatRoomDocument> {
    return await this.chatRooms.findById(id);
  }

  async findByWorkspace(workspaceId: string): Promise<IChatRoomDocument[]> {
    return await this.chatRooms.find({ workspaceId });
  }

  async update(id: string, data: Partial<IChatRoom>): Promise<IChatRoomDocument> {
    const chatRoom = await this.chatRooms.findById(id);
    if (!chatRoom) {
      throw new Error(`ChatRoom with id ${id} not found`);
    }
    Object.assign(chatRoom, data);
    return await chatRoom.save();
  }

  async delete(id: string): Promise<IChatRoomDocument> {
    return await this.chatRooms.findByIdAndDelete(id);
  }
}
