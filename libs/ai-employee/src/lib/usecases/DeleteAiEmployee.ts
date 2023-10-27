import { IAiEmployeeRepository } from "../repositories/AiEmployeeRepository";

export class DeleteAiEmployee {
  private aiEmployeeRepository: IAiEmployeeRepository;

  constructor(aiEmployeeRepository: IAiEmployeeRepository) {
    this.aiEmployeeRepository = aiEmployeeRepository;
  }

  async execute(id: string): Promise<void> {
    const aiEmpployee = await this.aiEmployeeRepository.findById(id);

    if (!aiEmpployee) {
      throw new Error('Ai employee not exists');
    }

    await this.aiEmployeeRepository.delete(id);
  }
}