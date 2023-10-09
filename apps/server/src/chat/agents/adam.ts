import { AIEmployee } from '@cognum/ai-employee';
import { IChat, IUser } from '@cognum/interfaces';
import { Callbacks } from 'langchain/dist/callbacks';

export class Adam extends AIEmployee {
  constructor(data: { chat: IChat; user: IUser; callbacks?: Callbacks }) {
    const identity = {
      name: 'Adam',
      profession: 'Data Scientist',
    };
    super({ ...data, identity });
  }
}
