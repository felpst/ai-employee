import { Schema } from "mongoose";

export interface IMessage {
  id: string;
  content: string;
  senderId: string | Schema.Types.ObjectId;
  chatRoomId: string | Schema.Types.ObjectId;
  timestamp: Date;
}

export class Message implements IMessage {
  id = Math.random().toString(36).substring(2, 9);
  content = '';
  senderId = '';
  chatRoomId = '';
  timestamp = new Date();

  constructor(params: Partial<IMessage> = {}) {
    Object.assign(this, params);
  }
}
