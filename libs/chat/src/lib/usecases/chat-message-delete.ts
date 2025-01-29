import { ChatMessageRepository } from "../repositories";

export class ChatMessageDelete {
  constructor(
    private chatMessageRepository: ChatMessageRepository
  ) { }

  async execute(id: string) {
    return this.chatMessageRepository.delete(id);
  }
}
