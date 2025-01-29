import { MoongoseQuery } from "@cognum/helpers";
import { ChatRoomRepository } from "../repositories";

export class ChatRoomFind {
  constructor(
    private chatRoomRepository: ChatRoomRepository
  ) { }

  async execute(query?: MoongoseQuery) {
    return this.chatRoomRepository.find(query);
  }
}
