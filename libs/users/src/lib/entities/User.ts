import { Types } from "mongoose";

export interface IUser {
  id?: string | Types.ObjectId;
  name: string;
  email: string;
  password: string;
  avatarUrl: string;
}

export class User implements IUser {
  id = Math.random().toString(36).substring(2, 9);
  name = '';
  email = '';
  password = '';
  avatarUrl = '';

  constructor(params: Partial<IUser> = {}) {
    Object.assign(this, params);
  }
}
