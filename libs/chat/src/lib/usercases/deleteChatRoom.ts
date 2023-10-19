import { IChatRoomRepository } from "../repositories/ChatRoomRepository";

export class DeleteChatRoom {
  private chatRoomRepository: IChatRoomRepository;

  constructor(chatRoomRepository: IChatRoomRepository) {
    this.chatRoomRepository = chatRoomRepository;
  }

  async execute(id: string): Promise<void> {
    // Save chat room
    await this.chatRoomRepository.delete(id);
  }
}
