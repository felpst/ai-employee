import { DefaultModel } from './default.model';

export interface ICompany extends DefaultModel {
  name: string;
  description: string;
}
