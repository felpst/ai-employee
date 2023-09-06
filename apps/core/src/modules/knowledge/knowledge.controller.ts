import { Knowledge } from '@cognum/models';
import ModelController from '../../controllers/model.controller';

export class KnowledgeController extends ModelController<typeof Knowledge> {
  constructor() {
    super(Knowledge);
  }
}

export default new KnowledgeController();
