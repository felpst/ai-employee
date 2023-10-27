import { IToken } from '@cognum/interfaces';
import { Schema, model } from 'mongoose';
import { triggers } from './default.model';

const schema = new Schema<IToken>({
  used: { type: Boolean, required: true, default: false },
  expiresIn: { type: Date, required: true },
  token: { type: String, required: false },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
triggers(schema);

const Token = model<IToken>('Token', schema);
export default Token;
