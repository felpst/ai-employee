import { ChatRoomRepository } from "../repositories/chat-room.repository";

export class ChatRoomDelete {
  constructor(
    private chatRoomRepository: ChatRoomRepository
  ) { }

  async execute(id: string) {
    return this.chatRoomRepository.delete(id);
  }
}
