import { IChatMessage } from "@cognum/interfaces";
import { ChatMessageRepository } from "../repositories";

export class ChatMessageCreate {

  constructor(
    private chatMessageRepository: ChatMessageRepository
  ) { }

  async execute(data: Partial<IChatMessage>) {
    this.chatMessageRepository.setUserId(data.sender as string);
    return this.chatMessageRepository.create(data) as Promise<IChatMessage>;
  }
}
