import { Schema } from "mongoose";
import { Message } from "../entities/Message";
import { IChatRoomRepository } from "../repositories/ChatRoomRepository";
import { IMessageRepository } from "../repositories/MessageRepository";

interface CreateMessageRequest {
  content: string;
  senderId: string | Schema.Types.ObjectId;
  chatRoomId: string | Schema.Types.ObjectId;
  timestamp: Date;
}

interface CreatemessageResponse {
  id: string;
  content: string;
  senderId: string | Schema.Types.ObjectId;
  chatRoomId: string | Schema.Types.ObjectId;
  timestamp: Date;
}

export class SendMessage {
  private messageRepository: IMessageRepository;
  private chatRoomRepository: IChatRoomRepository;

  constructor(messageRepository: IMessageRepository, chatRoomRepository: IChatRoomRepository) {
    this.messageRepository = messageRepository;
    this.chatRoomRepository = chatRoomRepository;
  }

  async execute(request: CreateMessageRequest): Promise<CreatemessageResponse> {

    // Check if chat room already exists
    const chatRoomExists = await this.chatRoomRepository.findById(request.chatRoomId.toString());
    if (chatRoomExists) {
      throw new Error('Chat not exists');
    }

    // Create new chat room entity
    const message = new Message(request);

    // Save chat room
    const savedMessage = await this.messageRepository.create(message);

    return {
      id: savedMessage.id.toString(),
      content: savedMessage.content,
      senderId: savedMessage.senderId.toString(),
      chatRoomId: savedMessage.chatRoomId.toString(),
      timestamp: savedMessage.timestamp
    };
  }
}
