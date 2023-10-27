import { DefaultModel } from './default.model';
import { IUser } from './user.interface';

export interface IWorkspace extends DefaultModel {
  name: string;
  description?: string;
  photo?: string;
  accessLink?: string;
  private?: boolean;
  users: string[] | IUser[];
}
