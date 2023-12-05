import { IAIEmployeeCallStep } from '@cognum/interfaces';
import { Schema } from 'mongoose';

const callStepSchema: Schema = new Schema<IAIEmployeeCallStep>(
  {
    type: { type: String },
    input: { type: Schema.Types.Mixed, default: {} },
    output: { type: Schema.Types.Mixed, default: {} },
    tokenUsage: { type: Number, default: 0 },
    status: { type: String, enum: ['running', 'done'], default: 'running' },
    startAt: { type: Schema.Types.Date, default: new Date() },
    endAt: { type: Schema.Types.Date },
  }
);
export { callStepSchema };

