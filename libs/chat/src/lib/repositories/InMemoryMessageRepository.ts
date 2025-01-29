import { IMessage, Message } from '../entities/Message';
import { IMessageRepository } from './MessageRepository';

export class InMemoryMessageRepository implements IMessageRepository {
  private messages: IMessage[] = [];

  async create(data: Partial<IMessage>): Promise<IMessage> {

    const message = new Message(data);

    this.messages.push(message);
    
    return Promise.resolve(message)
  }

  async findAll(): Promise<IMessage[]> {
    return Promise.resolve(this.messages)
  }

  async findById(id: string): Promise<IMessage> {
    const message = this.messages.find(u => u.id === id);
    return Promise.resolve(message);
  }

  async findByChatRoomId(chatRoomId: string): Promise<IMessage[]> {
    const message = this.messages.filter(u => u.chatRoomId.toString() === chatRoomId);
    return Promise.resolve(message);
  }

  async update(id: string, data: Partial<IMessage>): Promise<IMessage> {
    const index = this.messages.findIndex(u => u.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Message not found'));
    }
    const message = { ...this.messages[index], ...data };
    this.messages[index] = message as Message;
    return Promise.resolve(message);
  }

  async delete(id: string): Promise<void> {
    const index = this.messages.findIndex(u => u.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Message not found'));
    }
    const message = this.messages.splice(index, 1)[0];
    Promise.resolve(message);
  }
}
