import { Schema } from "mongoose";
import { IMessageRepository } from "../repositories/MessageRepository";

interface FindMessageResponse {
  id: string;
  content: string;
  senderId: string | Schema.Types.ObjectId;
  chatRoomId: string | Schema.Types.ObjectId;
  timestamp: Date;
}

export class FindMessage {
  private messageRepository: IMessageRepository;

  constructor(messageRepository: IMessageRepository) {
    this.messageRepository = messageRepository;
  }

  async byId(id: string): Promise<FindMessageResponse> {

    const message = await this.messageRepository.findById(id);

    if(!message) {
      throw new Error('Message not found');
    }

    return {
      id: message.id.toString(),
      content: message.content,
      senderId: message.senderId.toString(),
      chatRoomId: message.chatRoomId.toString(),
      timestamp: message.timestamp
    };
  }

  async byChatRoomId(chatRoomId: string): Promise<FindMessageResponse[]> {
    
    const messages = await this.messageRepository.findByChatRoomId(chatRoomId);

    if(!messages || messages.length <= 0) {
      throw new Error('Messages not found');
    }

    return messages.map(msg => {
      return {
        id: msg.id.toString(),
        content: msg.content,
        senderId: msg.senderId.toString(),
        chatRoomId: msg.chatRoomId.toString(),
        timestamp: msg.timestamp
      };
    })
  }

  async all(): Promise<FindMessageResponse[]> {
    const messages = await this.messageRepository.findAll();

    if(!messages || messages.length <= 0) {
      throw new Error('Messages not found');
    }

    return messages.map(msg => {
      return {
        id: msg.id.toString(),
        content: msg.content,
        senderId: msg.senderId.toString(),
        chatRoomId: msg.chatRoomId.toString(),
        timestamp: msg.timestamp
      };
    })
  }
}
