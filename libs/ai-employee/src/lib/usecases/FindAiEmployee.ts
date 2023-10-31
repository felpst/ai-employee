import { AiEmployeeProfile } from "../entities/AiEmployee";
import { IAiEmployeeRepository } from "../repositories/AiEmployeeRepository";

export class FindAiEmployee {
  private aiEmployeeRepository: IAiEmployeeRepository;

  constructor(aiEmployeeRepository: IAiEmployeeRepository) {
    this.aiEmployeeRepository = aiEmployeeRepository;
  }

  async byId(id: string): Promise<AiEmployeeProfile> {
    const aiEmpployee = await this.aiEmployeeRepository.findById(id);

    if (!aiEmpployee) {
      throw new Error('Ai employee not exists');
    }

    return await new AiEmployeeProfile(aiEmpployee);
  }

  async findAll(): Promise<AiEmployeeProfile[]> {
    const aiEmpployees = await this.aiEmployeeRepository.findAll();

    if (!aiEmpployees || aiEmpployees.length === 0) {
      throw new Error('Ai employee not exists');
    }

    return aiEmpployees.map(employee => new AiEmployeeProfile(employee));
  }
}
