import { ChatRoom, IChatRoom } from "../entities/ChatRoom";
import { IChatRoomRepository } from "../repositories/ChatRoomRepository";


export class FindChatRoom {
  private chatRepository: IChatRoomRepository;

  constructor(chatRepository: IChatRoomRepository) {
    this.chatRepository = chatRepository;
  }

  async byId(id: string): Promise<IChatRoom> {

    // find chat room
    const findChat = await this.chatRepository.findById(id);

    // Create new chat room entity
    const chat = new ChatRoom(findChat);


    return chat
  }

  async byWorkspace(workspace: string): Promise<IChatRoom[]> {
     // find chat room
     const findChat = await this.chatRepository.findByWorkspace(workspace);

     // Create new chat room entity
     const chat = findChat.map(chat => new ChatRoom(chat));
 
 
     return chat;
  }

  async all(): Promise<IChatRoom[]> {
    // find chat room
    const findChat = await this.chatRepository.findAll();

    // Create new chat room entity
    const chat = findChat.map(chat => new ChatRoom(chat));


    return chat;
 }
}
