<<<<<<< HEAD
import { DefaultModel, IAgentCall } from "@cognum/interfaces";
=======
import { DefaultModel } from "@cognum/interfaces";
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
import { Schema } from "mongoose";

export interface IChatMessage extends DefaultModel {
  _id: string;
  content: string;
  sender: string | Schema.Types.ObjectId;
  role: 'user' | 'bot';
  chatRoom: string | Schema.Types.ObjectId;
<<<<<<< HEAD
  call?: string | Schema.Types.ObjectId | IAgentCall;
=======
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
}
