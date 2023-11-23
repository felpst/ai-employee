import { AIEmployee } from '@cognum/ai-employee';
import ModelController from '../../controllers/model.controller';

export class AiEmployeeController extends ModelController<typeof AIEmployee> {
  constructor() {
    super(AIEmployee);
  }
}

export default new AiEmployeeController();
