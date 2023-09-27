import { IAIEmployee } from '@cognum/interfaces';
import { Model, Schema, model } from 'mongoose';
import { defaultSchemaProps, triggers } from './default.model';
import Workspace from './workspace.model';

const schema = new Schema<IAIEmployee>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  workspaces: [{ type: Schema.Types.ObjectId, ref: 'Workspace' }],
  ...defaultSchemaProps,
});
triggers(schema);

// Dependency injection
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const workspace = Workspace; // Force import model

const AIEmployee: Model<IAIEmployee> = model<IAIEmployee>('AIEmployee', schema);
export default AIEmployee as Model<IAIEmployee>;
