import { IWorkspace } from '@cognum/interfaces';
import { Model, Schema, model } from 'mongoose';
import { defaultSchemaProps, triggers } from './default.model';
import User from './user.model';

const schema = new Schema<IWorkspace>({
  name: { type: String },
  description: { type: String },
  accessLink: { type: String },
  photo: { type: String },
  private: { type: Boolean },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  openaiAssistantId: { type: String },
  openaiThreadId: { type: String },
  ...defaultSchemaProps,
});
triggers(schema);

// Dependency injection
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const user = User; // Force import model

const Workspace: Model<IWorkspace> = model<IWorkspace>('Workspace', schema);
export default Workspace as Model<IWorkspace>;
