import { IAIEmployee } from '@cognum/interfaces';
import { defaultSchemaProps, triggers } from '@cognum/models';
import { Schema, model, models } from 'mongoose';

const schema = new Schema<IAIEmployee>(
  {
    name: { type: String, default: 'Atlas' },
    role: { type: String, default: 'Assistant' },
    avatar: { type: String, default: 'https://storage.googleapis.com/factory-assets/avatars/Avatar1.jpeg' },
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    tools: [{ type: String }],
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

