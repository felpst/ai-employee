import { IChat } from '@cognum/interfaces';
import { Schema, model } from 'mongoose';
import { defaultSchemaProps, triggers } from './default.model';

const schema = new Schema<IChat>({
  name: {
    type: String,
    default: 'New chat',
  },
  summary: {
    type: String,
  },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: false },
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  ...defaultSchemaProps,
});
triggers(schema);

const Chat = model<IChat>('Chat', schema);
export default Chat;
