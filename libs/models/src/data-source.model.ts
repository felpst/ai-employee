import { IDataSource } from '@cognum/interfaces';
import mongoose, { Schema } from 'mongoose';
import { defaultSchemaProps, triggers } from './default.model';

const schema: Schema = new Schema({
  name: { type: String, required: true },
  summary: { type: String },
  type: { type: String, required: true, enum: ['file', 'url', 'api', 'db'] },
  parent: { type: Schema.Types.ObjectId, ref: 'DataSource' },
  metadata: { type: Schema.Types.Mixed },
  ...defaultSchemaProps,
});
triggers(schema);

const DataSource = mongoose.model<IDataSource>('DataSource', schema);
export default DataSource;
