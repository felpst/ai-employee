import { AiEmployeeDTO } from "../entities/AiEmployee";
import { IAiEmployeeRepository } from "../repositories/AiEmployeeRepository";

interface UpdateAiEmployeeRequest {
  name: string;
  profession: string;
}

interface UpdateAiEmployeeResponse {
  id: string;
  name: string;
  profession: string;
}

export class UpdateAiEmployee {
  private aiEmployeeRepository: IAiEmployeeRepository;

  constructor(aiEmployeeRepository: IAiEmployeeRepository) {
    this.aiEmployeeRepository = aiEmployeeRepository;
  }

  async execute(id: string, request: UpdateAiEmployeeRequest): Promise<UpdateAiEmployeeResponse> {
    const dto = new AiEmployeeDTO(request);

    const aiEmployee = await this.aiEmployeeRepository.update(id, dto);

    return {
      id: aiEmployee.id.toString(),
      name: aiEmployee.name,
      profession: aiEmployee.profession
    };
  }
}