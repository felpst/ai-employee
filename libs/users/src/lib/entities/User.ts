import { Types } from "mongoose";

export interface IUser {
  id?: string | Types.ObjectId;
  name: string;
  email: string;
  password: string;
  avatarUrl: string;
}

export interface IUserDTO {
  id?: string
  name?: string;
  email?: string;
  password?: string;
  avatarUrl?: string;
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

export class UserDTO implements IUserDTO {
  name: string
  email: string
  password: string
  avatarUrl: string

  constructor(params: Partial<IUserDTO> = {}) {
   params.name ? this.name = params.name : undefined;
   params.email ? this.email = params.email : undefined;
   params.password ? this.password = params.password : undefined;
   params.avatarUrl ? this.avatarUrl = params.avatarUrl : undefined;
  }
}
