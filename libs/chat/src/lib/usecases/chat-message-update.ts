import { IChatMessage } from "@cognum/interfaces";
import { ChatMessageRepository } from "../repositories";

export class ChatMessageUpdate {
  constructor(
    private chatMessageRepository: ChatMessageRepository
  ) { }

  async execute(id: string, data: IChatMessage) {
    return this.chatMessageRepository.update(id, data);
  }
}
