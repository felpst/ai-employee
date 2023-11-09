import { Document, Schema } from 'mongoose';

interface IDefaultSchema extends Document {
  updatedAt: Date;
}

export const defaultSchemaProps = {
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
};

export const feedbackSchemaProps = {
  isPositive: { type: Boolean, required: false },
  comment: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
};

function _updatedAt(this: IDefaultSchema, next: any) {
  this.set({ updatedAt: new Date() });
  next();
}

export function triggers(schema: Schema) {
  schema.pre('save', _updatedAt);
  schema.pre('findOneAndUpdate', _updatedAt);
}
