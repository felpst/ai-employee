import { Schema } from 'mongoose';
import { DefaultModel } from './default.model';
import { IUser } from './user.interface';

export interface IToken extends DefaultModel {
  used: boolean;
  expiresIn: Schema.Types.Date;
  token?: string;
  user: Schema.Types.ObjectId | IUser;
}
