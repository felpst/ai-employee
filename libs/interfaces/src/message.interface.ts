import { Schema } from 'mongoose';
import { IChat } from './chat.interface';
import { DefaultModel } from './default.model';
import { IFeedback } from './feedback.interface';
import { IUser } from './user.interface';

export type MessageRole = 'HUMAN' | 'AI';

export interface IMessage extends DefaultModel {
  content: string;
  feedbacks: IFeedback[];
  role: MessageRole;
  thought?: string;
  user: Schema.Types.ObjectId | IUser;
  chat: Schema.Types.ObjectId | IChat | string;
  question?: Schema.Types.ObjectId | IMessage;
}
