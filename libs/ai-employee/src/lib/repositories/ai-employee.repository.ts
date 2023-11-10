import { RepositoryHelper } from "@cognum/helpers";
import { IAIEmployee } from "@cognum/interfaces";
import { AIEmployee } from "../models/ai-employee.model";
''
export class AIEmployeeRepository extends RepositoryHelper<IAIEmployee> {
  constructor(userId?: string) {
    super(AIEmployee, userId);
  }
}
