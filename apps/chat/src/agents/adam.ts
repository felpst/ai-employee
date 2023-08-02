import { IChat, IUser } from '@cognum/interfaces';
import { Callbacks } from 'langchain/dist/callbacks';
import { AIEmployee } from './ai_employee';

export class Adam extends AIEmployee {
  constructor(data: { chat: IChat; user: IUser; callbacks?: Callbacks }) {
    const identity = {
      name: 'Adam',
      profession: 'Data Scientist',
    };
    super({ ...data, identity });
  }
}
