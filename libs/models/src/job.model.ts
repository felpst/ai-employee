import { IJob } from '@cognum/interfaces';
import { Schema, model } from 'mongoose';
import { defaultSchemaProps, triggers } from './default.model';

const schema = new Schema<IJob>({
  name: { type: String, required: true },
  instructions: { type: String, required: true },
  frequency: { type: String, required: true },
  cron: { type: String, required: true },
  status: { type: String, required: false, enum: ['running', 'done'], default: 'running' },
  employee: { type: Schema.Types.ObjectId, ref: 'AIEmployee', required: true },
  ...defaultSchemaProps,
});
triggers(schema);

const Job = model<IJob>('Job', schema);
export default Job;
