import { IAIEmployee } from "@cognum/interfaces";
import { defaultSchemaProps } from '@cognum/models';
import { Schema } from "mongoose";
import { memorySchema } from "./memory.schema";
import { toolSettingsSchema } from "./tool-settings.schema";

const aiEmployeeSchema = new Schema<IAIEmployee>(
  {
    name: { type: String, default: 'Atlas' },
    role: { type: String, default: 'Assistant' },
    avatar: { type: String, default: 'https://storage.googleapis.com/factory-assets/avatars/Avatar1.jpeg' },
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    tools: { type: [toolSettingsSchema], default: [] },
    memory: { type: [memorySchema], default: [] },
    ...defaultSchemaProps,
  },
  {
    timestamps: true,
    collection: 'ai-employees',
  }
);
export { aiEmployeeSchema };

