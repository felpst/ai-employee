import { DefaultModel, IAgentCall } from "@cognum/interfaces";
import { Schema } from "mongoose";

export interface IChatMessage extends DefaultModel {
  _id: string;
  content: string;
  sender: string | Schema.Types.ObjectId;
  role: 'user' | 'bot';
  chatRoom: string | Schema.Types.ObjectId;
  call?: string | Schema.Types.ObjectId | IAgentCall;
}
