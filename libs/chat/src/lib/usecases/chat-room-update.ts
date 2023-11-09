import { IChatRoom } from "@cognum/interfaces";
import { ChatRoomRepository } from "../repositories";

export class ChatRoomUpdate {
  constructor(
    private chatRoomRepository: ChatRoomRepository
  ) { }

  async execute(id: string, data: IChatRoom) {
    return this.chatRoomRepository.update(id, data);
  }
}
