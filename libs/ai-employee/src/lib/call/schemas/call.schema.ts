import { IAIEmployeeCall } from "@cognum/interfaces";
import { defaultSchemaProps } from '@cognum/models';
import { Schema } from "mongoose";
import { callStepSchema } from "./call-step.schema";

const aiEmployeeCallSchema: Schema = new Schema<IAIEmployeeCall>(
  {
    input: { type: String, default: '' },
    output: { type: String, default: '' },
    steps: { type: [callStepSchema], default: [] },
    totalTokenUsage: { type: Number, default: 0 },
    status: { type: String, enum: ['not_started', 'running', 'done'], default: 'not_started' },
    startAt: { type: Schema.Types.Date },
    endAt: { type: Schema.Types.Date },
    context: { type: Schema.Types.Mixed, default: {} },
    aiEmployee: { type: Schema.Types.ObjectId, ref: 'AIEmployee', required: true },
    ...defaultSchemaProps,
  },
  {
    timestamps: true,
    collection: 'ai-employee-calls',
  }
);

export { aiEmployeeCallSchema };

