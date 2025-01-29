import { Document, Schema } from 'mongoose';
import { IUser } from './user.interface';

export class DefaultModel extends Document {
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: Schema.Types.ObjectId | IUser | string;
  updatedBy?: Schema.Types.ObjectId | IUser | string;
}
