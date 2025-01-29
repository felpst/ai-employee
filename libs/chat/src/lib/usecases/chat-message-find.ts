import { MoongoseQuery } from "@cognum/helpers";
import { ChatMessageRepository } from "../repositories";

export class ChatMessageFind {
  constructor(
    private chatMessageRepository: ChatMessageRepository
  ) { }

  async execute(query?: MoongoseQuery) {
    return this.chatMessageRepository.find(query);
  }
}
