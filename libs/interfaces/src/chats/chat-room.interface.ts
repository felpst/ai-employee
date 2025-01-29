import { DefaultModel, IAIEmployee } from "@cognum/interfaces";
import { Schema } from "mongoose";

export interface IChatRoom extends DefaultModel {
  _id: string | Schema.Types.ObjectId;
  name: string;
  summary: string;
  senders: string[] | Schema.Types.ObjectId[];
  aiEmployee: string | Schema.Types.ObjectId | IAIEmployee;
}
