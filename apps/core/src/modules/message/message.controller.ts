import { Message } from '@cognum/models';
import ModelController from '../../controllers/model.controller';

export class MessageController extends ModelController<typeof Message> {
  constructor() {
    super(Message);
  }
}

export default new MessageController();
