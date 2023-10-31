import { InMemoryAiEmployeeRepository } from "../repositories/InMemoryAiEmployeeRepository";
import { UpdateAiEmployee } from "../usecases/UpdateAiEmployee";

describe('UpdateAiEmployee', () => {
const request = {
  name: 'Bob',
  profession: 'Engineer'
}

const aiEmployeeRepository = new InMemoryAiEmployeeRepository();

let _id: string

beforeAll(async () => {
  const aiEmployee = await aiEmployeeRepository.create({
    _id: Math.random().toString(36).substring(2, 9),
    name: 'John',
    profession: 'Developer'
  })

  _id = aiEmployee._id.toString()
})

  it('should update a ai employee', async () => {
    const updateAiEmployee = new UpdateAiEmployee(aiEmployeeRepository)

    const result = await updateAiEmployee.execute(_id, request)

    expect(result.id).toBeDefined()
    expect(result.name).toBe(request.name)
    expect(result.profession).toBe(request.profession)
  })
})

