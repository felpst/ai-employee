import { Model, Schema, model } from "mongoose";
import { IMessage } from "../entities/Message";

interface IMessageDocument extends IMessage, Document {}

const messageSchema = new Schema<IMessageDocument>(
  {
    content: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, required: true },
    chatRoomId: { type: Schema.Types.ObjectId, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export interface IMessageRepository {
  create(data: Partial<IMessage>): Promise<IMessage>;
  findAll(): Promise<IMessage[]>;
  findById(id: string): Promise<IMessage>;
  findByChatRoomId(chatRoomId: string): Promise<IMessage[]>;
  update(id: string, data: Partial<IMessage>): Promise<IMessage>;
  delete(id: string): Promise<void>;
}

const MessageModel = model<IMessageDocument>("Message", messageSchema);

export class MessageRepository implements IMessageRepository {
  private model: Model<IMessageDocument>;

  constructor(model: Model<IMessageDocument> = MessageModel) {
    this.model = model;
  }

  async create(data: Partial<IMessage>): Promise<IMessageDocument> {
    return await this.model.create(data);
  }

  async findAll(): Promise<IMessageDocument[]> {
    return await this.model.find();
  }

  async findById(id: string): Promise<IMessageDocument> {
    return await this.model.findById(id);
  }

  async findByChatRoomId(chatRoomId: string): Promise<IMessageDocument[]> {
    return await this.model.find({ chatRoomId });
  }

  async update(id: string, data: Partial<IMessage>): Promise<IMessageDocument> {
    const message = await this.model.findById(id);
    if (!message) {
      throw new Error(`Message with id ${id} not found`);
    }
    Object.assign(message, data);
    return await message.save();
  }

  async delete(id: string): Promise<void> {
    const message = await this.model.findById(id);
    if (!message) {
      throw new Error(`Message with id ${id} not found`);
    }
    return await this.model.findByIdAndDelete(id);
  }

}
