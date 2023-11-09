import { IMessageRepository } from "../repositories/MessageRepository";

export class DeleteMessage {
  private messageRepository: IMessageRepository;

  constructor(messageRepository: IMessageRepository) {
    this.messageRepository = messageRepository;
  }


  async execute(id: string): Promise<void> {
    await this.messageRepository.delete(id);

  }
}
