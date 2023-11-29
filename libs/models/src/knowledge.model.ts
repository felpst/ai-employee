import { IKnowledge } from '@cognum/interfaces';
import { Schema, model } from 'mongoose';
import { defaultSchemaProps, triggers } from './default.model';

const schema = new Schema<IKnowledge>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  data: { type: String, required: true },
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  employees: [
    { type: Schema.Types.ObjectId, ref: 'AIEmployee', required: false },
  ],
  permissions: [
    {
      userId: { type: String, required: true },
      permission: { type: String, required: true, enum: ['Reader', 'Editor'] },
    },
  ],
  openaiFileId: { type: String, required: true },
  ...defaultSchemaProps,
});
triggers(schema);

const Knowledge = model<IKnowledge>('Knowledge', schema);
export default Knowledge;
