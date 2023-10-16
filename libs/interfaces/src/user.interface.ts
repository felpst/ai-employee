import { DefaultModel } from './default.model';

export interface IUser extends DefaultModel {
  name: string;
  email: string;
  password: string;
  active: boolean;
  profilePhoto?: string;
  company: string | ICompany;
}
