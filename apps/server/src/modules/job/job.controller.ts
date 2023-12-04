import { Job } from '@cognum/models';
import ModelController from '../../controllers/model.controller';

export class JobController extends ModelController<typeof Job> {
  constructor() {
    super(Job);
  }

}

export default new JobController();
