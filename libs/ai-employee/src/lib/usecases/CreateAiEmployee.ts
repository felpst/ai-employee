import { AiEmployeeProfile } from "../entities/AiEmployee";
import { IAiEmployeeRepository } from "../repositories/AiEmployeeRepository";

interface CreateAiEmployeeRequest {
  id: string;
  name: string;
  profession: string;
}

interface CreateAiEmployeeResponse {
  id: string;
  name: string;
  profession: string;
}

export class CreateAiEmployee {
  private aiEmployeeRepository: IAiEmployeeRepository;

  constructor(aiEmployeeRepository: IAiEmployeeRepository) {
    this.aiEmployeeRepository = aiEmployeeRepository;
  }

  async execute(request: CreateAiEmployeeRequest): Promise<CreateAiEmployeeResponse> {
    const aiEmpployee = await this.aiEmployeeRepository.findById(request.id);

    if (aiEmpployee) {
      throw new Error('Ai employee already exists');
    }

    const entity = new AiEmployeeProfile(request);

    const aiEmployee = await this.aiEmployeeRepository.create(entity);

    return {
      id: aiEmployee._id.toString(),
      name: aiEmployee.name,
      profession: aiEmployee.profession
    };
  }
}