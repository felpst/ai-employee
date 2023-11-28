<<<<<<< HEAD
import { Agent, IAIEmployee, IChatMessage, IChatRoom, IUser } from "@cognum/interfaces";
=======
import { Agent } from "@cognum/ai-employee";
import { IAIEmployee, IChatMessage, IChatRoom, IUser } from "@cognum/interfaces";
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
import { v4 as uuidv4 } from 'uuid';
import { WebSocket } from "ws";
import { ISession } from "../interfaces/session.interface";

export class Session implements ISession {
  id: string = uuidv4();
  socket: WebSocket;
  user!: IUser;
  chatRoom!: IChatRoom;
  chatMessages!: IChatMessage[];
  senders!: (IUser | IAIEmployee)[];
  aiEmployee!: IAIEmployee;
  agent!: Agent;

  constructor(session: Partial<ISession>) {
    Object.assign(this, session);
  }
}
