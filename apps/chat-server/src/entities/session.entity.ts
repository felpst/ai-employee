import { AIEmployeeAgent } from "@cognum/ai-employee";
import { IAIEmployee, IChatMessage, IChatRoom, IUser } from "@cognum/interfaces";
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
  agent!: AIEmployeeAgent;

  constructor(session: Partial<ISession>) {
    Object.assign(this, session);
  }
}
