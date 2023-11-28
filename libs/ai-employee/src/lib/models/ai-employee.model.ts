import { IAIEmployee } from '@cognum/interfaces';
import { defaultSchemaProps, triggers } from '@cognum/models';
import { Schema, model, models } from 'mongoose';

<<<<<<< HEAD
const toolSchemaProps = {
  id: { type: String, required: true },
  options: {
    type: Schema.Types.Mixed,
    required: false,
    default: {},
  }
};

=======
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
const schema = new Schema<IAIEmployee>(
  {
    name: { type: String, default: 'Atlas' },
    role: { type: String, default: 'Assistant' },
    avatar: { type: String, default: 'https://storage.googleapis.com/factory-assets/avatars/Avatar1.jpeg' },
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
<<<<<<< HEAD
    tools: { type: [toolSchemaProps], default: [] },
=======
    tools: [{ type: String, default: [] }],
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
    ...defaultSchemaProps,
  },
  {
    timestamps: true,
    collection: 'ai-employees',
  }
);
triggers(schema);

const AIEmployee = models['AIEmployee'] || model<IAIEmployee>('AIEmployee', schema);
export { AIEmployee };

