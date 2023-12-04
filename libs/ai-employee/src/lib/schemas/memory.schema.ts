import { IAIEmployeeMemory } from "@cognum/interfaces";
import { Schema } from "mongoose";

const memorySchema = new Schema<IAIEmployeeMemory>({
  pageContent: { type: String, required: true },
  metadata: {
    type: Schema.Types.Mixed,
    required: false,
    default: {},
  }
});

export { memorySchema };

