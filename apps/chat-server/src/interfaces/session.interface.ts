<<<<<<< HEAD
import { Agent, IUser } from "@cognum/interfaces";
=======
import { Agent } from "@cognum/ai-employee";
import { IUser } from "@cognum/interfaces";
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
import { WebSocket } from "ws";

export interface ISession {
  id: string;
  socket: WebSocket;
  user?: IUser;
  agent?: Agent;
}
