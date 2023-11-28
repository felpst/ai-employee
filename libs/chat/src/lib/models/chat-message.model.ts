<<<<<<< HEAD
import { IChatMessage } from '@cognum/interfaces';
import { defaultSchemaProps, triggers } from '@cognum/models';
import { Schema, model, models } from 'mongoose';

const schema = new Schema<IChatMessage>(
  {
    content: { type: String },
    sender: { type: Schema.Types.ObjectId, required: true },
    role: { type: Schema.Types.String, required: true, enum: ['user', 'bot'] },
    chatRoom: { type: Schema.Types.ObjectId, ref: 'ChatRoom', required: true, },
    call: { type: Schema.Types.ObjectId, ref: 'AgentCall' },
=======
import { defaultSchemaProps, triggers } from '@cognum/models';
import { Schema, model, models } from 'mongoose';
import { IChatMessage } from '../../../../interfaces/src/chats';

const schema = new Schema<IChatMessage>(
  {
    content: { type: String, required: true },
    sender: { type: Schema.Types.ObjectId, required: true },
    role: { type: Schema.Types.String, required: true, enum: ['user', 'bot'] },
    chatRoom: { type: Schema.Types.ObjectId, ref: 'ChatRoom', required: true, },
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
    ...defaultSchemaProps,
  },
  {
    timestamps: true,
    collection: 'chat-messages',
  }
);
triggers(schema);

const ChatMessage = models['ChatMessage'] || model<IChatMessage>('ChatMessage', schema);
export { ChatMessage };

