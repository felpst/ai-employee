import { ICronJob, IJob } from '@cognum/interfaces';
import { Schema, model } from 'mongoose';
import { defaultSchemaProps, triggers } from './default.model';

const cronSchema = new Schema<ICronJob>({
  name: { type: String, required: true },
  description: { type: String, required: false },
  schedule: { type: String, required: false },
  timeZone: { type: String, required: false },
  httpTarget: {
    uri: { type: String, required: false },
    httpMethod: { type: String, required: false },
    body: { type: String, required: false },
  },
});

const schema = new Schema<IJob>({
  name: { type: String, required: true },
  instructions: { type: String, required: true },
  frequency: { type: String, required: true },
  cron: { type: cronSchema, required: false },
  status: { type: String, required: false, enum: ['running', 'stopped'], default: 'running' },
  aiEmployee: { type: Schema.Types.ObjectId, ref: 'AIEmployee', required: true },
  ...defaultSchemaProps,
});
triggers(schema);

const Job = model<IJob>('Job', schema);
export default Job;
