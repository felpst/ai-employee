import { ICompany } from '@cognum/interfaces';
import { Schema, model } from 'mongoose';
import { defaultSchemaProps, triggers } from './default.model';

const schema = new Schema<ICompany>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  ...defaultSchemaProps,
});
triggers(schema);

const Company = model<ICompany>('Company', schema);
export default Company;
