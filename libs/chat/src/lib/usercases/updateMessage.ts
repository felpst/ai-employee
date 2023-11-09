import { Schema } from "mongoose";
import { IMessageRepository } from "../repositories/MessageRepository";

interface UpdateMessageResponse {
  id: string;
  content: string;
  senderId: string | Schema.Types.ObjectId;
  chatRoomId: string | Schema.Types.ObjectId;
  timestamp: Date;
}

export class UpdateMessage {
  private messageRepository: IMessageRepository;

  constructor(messageRepository: IMessageRepository) {
    this.messageRepository = messageRepository;
  }


  async execute(id: string, _content: string): Promise<UpdateMessageResponse> {

    const savedMessage = await this.messageRepository.update(id, { content: _content });

    return {
      id: savedMessage.id.toString(),
      content: savedMessage.content,
      senderId: savedMessage.senderId.toString(),
      chatRoomId: savedMessage.chatRoomId.toString(),
      timestamp: savedMessage.timestamp
    };
  }
}
