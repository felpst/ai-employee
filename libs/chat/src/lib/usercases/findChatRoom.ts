import { ChatRoom } from "../entities/ChatRoom";
import { IChatRoomDocument, IChatRoomRepository } from "../repositories/ChatRoomRepository";


export class FindChatRoom {
  private chatRepository: IChatRoomRepository;
  private document: Document

  constructor(chatRepository: IChatRoomRepository) {
    this.chatRepository = chatRepository;
  }

  async byId(id: string): Promise<IChatRoomDocument> {

    // find chat room
    const findChat = await this.chatRepository.findById(id);

    // Create new chat room entity
    const chat = new ChatRoom(findChat);

    document = new Document();

    Object.assign(chat, ...document);

    return chat
  }

  async byWorkspace(workspace: string): Promise<IChatRoomDocument[]> {
     // find chat room
     const findChat = await this.chatRepository.findByWorkspace(workspace);

     // Create new chat room entity
     const chat = findChat.map(chat => new ChatRoom(chat));
 
 
     return chat;
  }

  async all(): Promise<IChatRoomDocument[]> {
    // find chat room
    const findChat = await this.chatRepository.findAll();

    // Create new chat room entity
    const chat = findChat.map(chat => new ChatRoom(chat));


    return chat;
 }
}
