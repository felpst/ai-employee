import { AIEmployeeMemory } from '@cognum/tools';
import { LLMChain } from 'langchain/chains';
import { Callbacks } from 'langchain/dist/callbacks';
import { AiEmployee, AiEmployeeModel } from "../entities/AiEmployee";
import { IAiEmployeeRepository } from "../repositories/AiEmployeeRepository";

export class FindAiEmployee {
  private aiEmployeeRepository: IAiEmployeeRepository;

  constructor(aiEmployeeRepository: IAiEmployeeRepository) {
    this.aiEmployeeRepository = aiEmployeeRepository;
  }

  async byIdentityId(id: string): Promise<AiEmployeeModel> {
    const aiEmpployee = await this.aiEmployeeRepository.findById(id);

    if (!aiEmpployee) {
      throw new Error('Ai employee not exists');
    }

    return await new AiEmployeeModel(aiEmpployee);
  }

  async findIdentityAll(): Promise<AiEmployeeModel[]> {
    const aiEmpployees = await this.aiEmployeeRepository.findAll();

    if (!aiEmpployees || aiEmpployees.length === 0) {
      throw new Error('Ai employee not exists');
    }

    return aiEmpployees.map(employee => new AiEmployeeModel(employee));
  }

  async byId(id: string, _callbacks: Callbacks, _chain: LLMChain, _memory: AIEmployeeMemory): Promise<AiEmployee> {
    const aiEmpployee = await this.aiEmployeeRepository.findById(id);

    if (!aiEmpployee) {
      throw new Error('Ai employee not exists');
    }

    const entity = {
      id: aiEmpployee.id,
      name: aiEmpployee.name,
      profession: aiEmpployee.profession,
      callbacks: _callbacks,
      chain: _chain,
      memory: _memory
    }

    return new AiEmployee(entity);
  }

  async findAll(_callbacks: Callbacks, _chain: LLMChain, _memory: AIEmployeeMemory): Promise<AiEmployee[]> {
    const aiEmpployees = await this.aiEmployeeRepository.findAll();

    if (!aiEmpployees || aiEmpployees.length === 0) {
      throw new Error('Ai employee not exists');
    }

    return aiEmpployees.map(employee => {
      const entity = {
        id: employee.id,
        name: employee.name,
        profession: employee.profession,
        callbacks: _callbacks,
        chain: _chain,
        memory: _memory
      }

      return new AiEmployee(entity);
    });
  }
}
