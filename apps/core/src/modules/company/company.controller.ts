import { Company } from '@cognum/models';
import ModelController from '../../controllers/model.controller';

export class CompanyController extends ModelController<typeof Company> {
  constructor() {
    super(Company);
  }
}

export default new CompanyController();
