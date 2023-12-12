import { AIEmployeeCall } from '@cognum/ai-employee';
import ModelController from '../../../controllers/model.controller';

export class AiEmployeeCallsController extends ModelController<typeof AIEmployeeCall> {
  constructor() {
    super(AIEmployeeCall);
  }
}

export default new AiEmployeeCallsController();
