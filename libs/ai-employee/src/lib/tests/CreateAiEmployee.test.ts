import { InMemoryAiEmployeeRepository } from "../repositories/InMemoryAiEmployeeRepository";
import { CreateAiEmployee } from "../usecases/CreateAiEmployee";

describe('CreateAiEmployee', () => {
const request = {
  id: Math.random().toString(36).substring(2, 9),
  name: 'John',
  profession: 'Developer'
}

const aiEmployeeRepository = new InMemoryAiEmployeeRepository();

  it('should create a new ai employee', async () => {
    const createAiEmployee = new CreateAiEmployee(aiEmployeeRepository)

    const result = await createAiEmployee.execute(request)

    expect(result.id).toBeDefined()
    expect(result.name).toBe(request.name)
    expect(result.profession).toBe(request.profession)
  })
})

