import { AiEmployee } from "../entities/AiEmployee";

export class ChatHistory {
  private aiEmployee: AiEmployee;

  constructor(aiEmployee: AiEmployee) {
    this.aiEmployee = aiEmployee;
  }

  async execute(numberOfMessages = 10) {
    const messages = this.aiEmployee.memory.getLastMessages(numberOfMessages);
      return messages.map((message) => ({
        _id: message._id,
        content: message.content,
        role: message.role,
        feedbacks: message.feedbacks,
        createdBy: message.createdBy,
        createdAt: message.createdAt,
      })
    );
  }
}