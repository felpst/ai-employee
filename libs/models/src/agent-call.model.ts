import { IAgentCall } from '@cognum/interfaces';
import mongoose, { Schema } from 'mongoose';
import {
  defaultSchemaProps,
  triggers,
} from './default.model';

const schema: Schema = new Schema(
  {
    input: { type: String },
    output: { type: String },
    tasks: [{ type: Schema.Types.Mixed }],
    callTokenUsage: { type: Number },
    totalTokenUsage: { type: Number },
    status: { type: String, required: true, enum: ['running', 'done'] },
    agent: { type: String },
    aiEmployee: { type: Schema.Types.ObjectId, ref: 'AIEmployee', required: true },
    ...defaultSchemaProps,
  },
  {
    collection: 'agent-calls',
  }
);
triggers(schema);

const AgentCall = mongoose.model<IAgentCall>('AgentCall', schema);
export default AgentCall;
