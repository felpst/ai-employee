import { Model, Schema, model } from "mongoose";
import { IChatRoom } from "../entities/ChatRoom";

export interface IChatRoomDocument extends IChatRoom, Document {}

const chatRoomSchema = new Schema<IChatRoomDocument>(
  {
    name: { type: String, required: true },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  {
    timestamps: true,
  }
);

export interface IChatRoomRepository {
  create(data: Partial<IChatRoom>): Promise<IChatRoom>;
  findAll(): Promise<IChatRoom[]>;
  findById(id: string): Promise<IChatRoom>;
  findByWorkspace(workspaceId: string): Promise<IChatRoom[]>;
  update(id: string, data: Partial<IChatRoom>): Promise<IChatRoom>;
  delete(id: string): Promise<void>;
}

const ChatRoomModel = model<IChatRoomDocument>("ChatRoom", chatRoomSchema);

export class ChatRoomRepository implements IChatRoomRepository {
  private model: Model<IChatRoomDocument>;

  constructor(model: Model<IChatRoomDocument> = ChatRoomModel) {
    this.model = model;
  }

  async create(data: Partial<IChatRoom>): Promise<IChatRoom> {
    return await this.model.create(data);
  }

  async findAll(): Promise<IChatRoom[]> {
    return await this.model.find();
  }

  async findById(id: string): Promise<IChatRoom> {
    return await this.model.findById(id);
  }

  async findByWorkspace(workspaceId: string): Promise<IChatRoom[]> {
    return await this.model.find({ workspaceId });
  }

  async update(id: string, data: Partial<IChatRoom>): Promise<IChatRoom> {
    const chatRoom = await this.model.findById(id);
    if (!chatRoom) {
      throw new Error(`ChatRoom with id ${id} not found`);
    }
    Object.assign(chatRoom, data);
    return await chatRoom.save();
  }

  async delete(id: string): Promise<void> {
    return await this.model.findByIdAndDelete(id);
  }
}
