import { User } from '@cognum/models';
import ModelController from '../../controllers/model.controller';

export class UserController extends ModelController<typeof User> {
  constructor() {
    super(User);
  }
}

export default new UserController();
