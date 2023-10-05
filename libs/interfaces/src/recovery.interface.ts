import { Schema } from 'mongoose';
import { DefaultModel } from './default.model';
import { IUser } from './user.interface';

export interface IRecovery extends DefaultModel {
  used: boolean;
  expiresIn: Schema.Types.Date;
  user: Schema.Types.ObjectId | IUser;
}
