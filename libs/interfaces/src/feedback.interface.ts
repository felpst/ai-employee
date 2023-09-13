import { Schema } from 'mongoose';
import { DefaultModel } from './default.model';
import { IUser } from './user.interface';

export interface IFeedback extends DefaultModel {
  isPositive: boolean;
  comment?: string;
  user: Schema.Types.ObjectId | IUser;
}
