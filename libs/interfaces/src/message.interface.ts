import { Schema } from 'mongoose';
import { IChat } from './chat.interface';
import { DefaultModel } from './default.model';
import { IUser } from './user.interface';

export type MessageRole = 'HUMAN' | 'AI';

export interface IMessage extends DefaultModel {
  content: string;
  rating?: string;
  suggestions?: string;
  role: MessageRole;
  user: Schema.Types.ObjectId | IUser;
  chat: Schema.Types.ObjectId | IChat;
  question?: Schema.Types.ObjectId | IMessage;
}
