import { Schema } from "mongoose";

export class SchemaUtils {
  private _updatedAt = function (next) {
    this.set({ updatedAt: new Date() });
    next();
  };

  triggers(schema: Schema) {
    schema.pre("save", this._updatedAt);
    schema.pre("findOneAndUpdate", this._updatedAt);
  }
}

export default new SchemaUtils();
