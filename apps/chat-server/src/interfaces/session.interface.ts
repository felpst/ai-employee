import { Agent } from "@cognum/ai-employee";
import { IUser } from "@cognum/interfaces";
import { WebSocket } from "ws";

export interface ISession {
  id: string;
  socket: WebSocket;
  user?: IUser;
  agent?: Agent;
}
