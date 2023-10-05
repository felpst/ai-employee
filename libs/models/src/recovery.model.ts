import { IRecovery } from '@cognum/interfaces';
import { Schema, model } from 'mongoose';
import { triggers } from './default.model';

const schema = new Schema<IRecovery>({
  used: { type: Boolean, required: true, default: false },
  expiresIn: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
triggers(schema);

const Recovery = model<IRecovery>('Recovery', schema);
export default Recovery;
