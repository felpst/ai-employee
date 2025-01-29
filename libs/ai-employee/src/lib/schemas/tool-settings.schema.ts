import { IToolSettings } from "@cognum/interfaces";
import { Schema } from "mongoose";

const toolSettingsSchema = new Schema<IToolSettings>({
  id: { type: String, required: true },
  options: {
    type: Schema.Types.Mixed,
    required: false,
    default: {},
  }
});

export { toolSettingsSchema };

