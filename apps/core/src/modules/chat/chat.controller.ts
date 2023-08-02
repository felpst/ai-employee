import { Chat } from '@cognum/models';
import ModelController from '../../controllers/model.controller';

export class ChatController extends ModelController<typeof Chat> {
  constructor() {
    super(Chat);
  }
}

export default new ChatController();
