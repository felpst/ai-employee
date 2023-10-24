import { DefaultModel } from './default.model';

export interface IUser extends DefaultModel {
  name: string;
  email: string;
  password: string;
}
