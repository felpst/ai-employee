import { IWorkspace } from '@cognum/interfaces';
import { Model, Schema, model } from 'mongoose';
import { defaultSchemaProps, triggers } from './default.model';
import User from './user.model';

const schema = new Schema<IWorkspace>({
  name: { type: String, required: true },
  description: { type: String, required: false },
  accessLink: { type: String, required: false },
  photo: { type: String, required: false },
  private: { type: Boolean, required: false },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  ...defaultSchemaProps,
});
triggers(schema);

// Dependency injection
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const user = User; // Force import model

const Workspace: Model<IWorkspace> = model<IWorkspace>('Workspace', schema);
export default Workspace as Model<IWorkspace>;
