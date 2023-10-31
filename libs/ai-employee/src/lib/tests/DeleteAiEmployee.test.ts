import { InMemoryAiEmployeeRepository } from "../repositories/InMemoryAiEmployeeRepository";
import { DeleteAiEmployee } from "../usecases/DeleteAiEmployee";

describe('DeleteAiEmployee', () => {
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

  it('should Delete a ai employee', async () => {
    const deleteAiEmployee = new DeleteAiEmployee(aiEmployeeRepository)

    expect(async () => await deleteAiEmployee.execute(_id)).not.toThrow()
  })
})

