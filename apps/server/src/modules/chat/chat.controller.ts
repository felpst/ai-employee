import { ChatRoom } from '@cognum/chat';
import ModelController from '../../controllers/model.controller';

export class ChatController extends ModelController<typeof ChatRoom> {
  constructor() {
    super(ChatRoom);
  }
}

export default new ChatController();
