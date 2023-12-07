import { AIEmployee } from '@cognum/ai-employee';
import { IChatRoom } from '@cognum/interfaces';
import { defaultSchemaProps, triggers } from '@cognum/models';
import { Schema, model, models } from 'mongoose';

const schema = new Schema<IChatRoom>(
  {
    name: { type: String, default: 'New chat' },
    summary: { type: String },
    aiEmployee: { type: Schema.Types.ObjectId, ref: 'AIEmployee', required: true, },
    senders: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    ...defaultSchemaProps,
  },
  {
    timestamps: true,
    collection: 'chat-rooms',
  }
);
triggers(schema);

// Force import models
AIEmployee;

const ChatRoom = models['ChatRoom'] || model<IChatRoom>('ChatRoom', schema);
export { ChatRoom };

