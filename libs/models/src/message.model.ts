import { IFeedback, IMessage } from '@cognum/interfaces';
import mongoose, { Schema } from 'mongoose';
import {
  defaultSchemaProps,
  feedbackSchemaProps,
  triggers,
} from './default.model';

export type MessageRole = 'HUMAN' | 'AI';
export type RatingRole = 'THUMBSUP' | 'THUMBSDOWN';

const feedbackSchema = new Schema<IFeedback>(feedbackSchemaProps);

const schema: Schema = new Schema({
  content: { type: String, required: true },
  role: { type: String, required: true, enum: ['HUMAN', 'AI'] },
  feedbacks: { type: [feedbackSchema], required: false, default: [] },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  question: { type: Schema.Types.ObjectId, ref: 'Message' },
  ...defaultSchemaProps,
});
triggers(schema);

const Message = mongoose.model<IMessage>('Message', schema);
export default Message;
