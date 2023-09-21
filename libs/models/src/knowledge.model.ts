import { IKnowledge } from '@cognum/interfaces';
import { Schema, model } from 'mongoose';
import { defaultSchemaProps, triggers } from './default.model';

const schema = new Schema<IKnowledge>({
  data: { type: String },
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  ...defaultSchemaProps,
});
triggers(schema);

const Knowledge = model<IKnowledge>('Knowledge', schema);
export default Knowledge;
