import { IJob, IJobScheduler } from '@cognum/interfaces';
import { Schema, model } from 'mongoose';
import { defaultSchemaProps, triggers } from './default.model';

const SchedulerSchema = new Schema<IJobScheduler>({
  name: { type: String, required: false },
  description: { type: String, required: false },
  schedule: { type: String, required: false },
  runOnce: { type: Boolean, default: false },
  frequency: { type: String, required: false },
  timeZone: { type: String, required: false },
  startAt: { type: Date, required: false, default: new Date() },
  endAt: { type: Date, required: false },
  httpTarget: {
    uri: { type: String, required: false },
    httpMethod: { type: String, required: false },
    body: { type: String, required: false },
  },
});

const schema = new Schema<IJob>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  instructions: { type: String, required: true },
  context: { type: Schema.Types.Mixed, required: false, default: {} },
  scheduler: { type: SchedulerSchema, required: false },
  status: { type: String, required: false, enum: ['running', 'stopped'], default: 'running' },
  aiEmployee: { type: Schema.Types.ObjectId, ref: 'AIEmployee', required: true },
  ...defaultSchemaProps,
});
triggers(schema);

const Job = model<IJob>('Job', schema);
export default Job;
