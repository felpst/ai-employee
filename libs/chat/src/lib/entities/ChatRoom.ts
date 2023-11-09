import { Schema } from "mongoose";
import { IMessage } from "./Message";

export interface IChatRoom {
  id: string | Schema.Types.ObjectId;
  name: string;
  messages: IMessage[];
  workspace: string | Schema.Types.ObjectId;
}

export interface IChatRoomDTO {
  name?: string;
  workspace?: string | Schema.Types.ObjectId;
}

export class ChatRoom implements IChatRoom {
  id = Math.random().toString(36).substring(2, 9);
  name = '';
  messages = [];
  workspace: string | Schema.Types.ObjectId;

  constructor(params: Partial<IChatRoom> = {}) {
    Object.assign(this, params);
  }
}

export class ChatRoomDTO implements IChatRoomDTO {
  name: string
  workspace: string | Schema.Types.ObjectId;

  constructor(params: Partial<IChatRoom> = {}) {
    params.name ? this.name = params.name : undefined;
    params.workspace ? this.workspace = params.workspace : undefined;
  }
}
