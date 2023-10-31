import { AiEmployeeProfile, IAiEmployeeProfile } from '../entities/AiEmployee';
import { IAiEmployeeRepository } from './AiEmployeeRepository';

export class InMemoryAiEmployeeRepository implements IAiEmployeeRepository {
  private aiEmployee: IAiEmployeeProfile[] = [];

  async create(data: Partial<IAiEmployeeProfile>): Promise<IAiEmployeeProfile> {

    const aiEmployee = new AiEmployeeProfile(data);

    this.aiEmployee.push(aiEmployee);
    
    return Promise.resolve(aiEmployee)
  }

  async findAll(): Promise<IAiEmployeeProfile[]> {
    return Promise.resolve(this.aiEmployee)
  }

  async findById(id: string): Promise<IAiEmployeeProfile> {
    const aiEmployee = this.aiEmployee.find(u => u._id === id);
    return Promise.resolve(aiEmployee);
  }

  async update(id: string, data: Partial<IAiEmployeeProfile>): Promise<IAiEmployeeProfile> {
    const index = this.aiEmployee.findIndex(u => u._id === id);
    if (index === -1) {
      return Promise.reject(new Error('AiEmployee not found'));
    }
    const updatedAiEmployee = { ...this.aiEmployee[index], ...data };
    this.aiEmployee[index] = updatedAiEmployee as AiEmployeeProfile;
    return Promise.resolve(updatedAiEmployee);
  }
 
  async delete(id: string): Promise<void> {
    const index = this.aiEmployee.findIndex(u => u._id === id);
    if (index === -1) {
      return Promise.reject(new Error('AiEmployee not found'));
    }
    const deletedAiEmployee = this.aiEmployee.splice(index, 1)[0];
    Promise.resolve(deletedAiEmployee);
  }
}
