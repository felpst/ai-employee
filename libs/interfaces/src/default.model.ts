import { Document, Schema } from 'mongoose';

export class DefaultModel extends Document {
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
}
