import { AiEmployeeModel, IAiEmployeeModel } from '../entities/AiEmployee';
import { IAiEmployeeRepository } from './AiEmployeeRepository';

export class InMemoryAiEmployeeRepository implements IAiEmployeeRepository {
  private aiEmployee: IAiEmployeeModel[] = [];

  async create(data: Partial<IAiEmployeeModel>): Promise<IAiEmployeeModel> {

    const aiEmployee = new AiEmployeeModel(data);

    this.aiEmployee.push(aiEmployee);
    
    return Promise.resolve(aiEmployee)
  }

  async findAll(): Promise<IAiEmployeeModel[]> {
    return Promise.resolve(this.aiEmployee)
  }

  async findById(id: string): Promise<IAiEmployeeModel> {
    const aiEmployee = this.aiEmployee.find(u => u.id === id);
    return Promise.resolve(aiEmployee);
  }

  async update(id: string, data: Partial<IAiEmployeeModel>): Promise<IAiEmployeeModel> {
    const index = this.aiEmployee.findIndex(u => u.id === id);
    if (index === -1) {
      return Promise.reject(new Error('AiEmployee not found'));
    }
    const updatedAiEmployee = { ...this.aiEmployee[index], ...data };
    this.aiEmployee[index] = updatedAiEmployee as AiEmployeeModel;
    return Promise.resolve(updatedAiEmployee);
  }
 
  async delete(id: string): Promise<void> {
    const index = this.aiEmployee.findIndex(u => u.id === id);
    if (index === -1) {
      return Promise.reject(new Error('AiEmployee not found'));
    }
    const deletedAiEmployee = this.aiEmployee.splice(index, 1)[0];
    Promise.resolve(deletedAiEmployee);
  }
}
