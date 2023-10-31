import { InMemoryAiEmployeeRepository } from '../repositories/InMemoryAiEmployeeRepository';
import { FindAiEmployee } from '../usecases/FindAiEmployee';

describe('FindAiEmployee', () => {
  const aiEmployeeRepository = new InMemoryAiEmployeeRepository();
  const findAiEmployee = new FindAiEmployee(aiEmployeeRepository)

  let _id: string

  beforeAll(async () => {
    const aiEmployee = await aiEmployeeRepository.create({
      _id: Math.random().toString(36).substring(2, 9),
      name: 'John',
      profession: 'Developer'
    })

    _id = aiEmployee._id.toString()

    await aiEmployeeRepository.create({
      _id: Math.random().toString(36).substring(2, 9),
      name: 'Bob',
      profession: 'Engineer'
    })
  })

  it('should find a ai employee by id', async () => {
    const aiEmployee = await findAiEmployee.byId(_id)

    expect(aiEmployee._id).toBeDefined()
    expect(aiEmployee.name).toBe('John')
    expect(aiEmployee.profession).toBe('Developer')
  })

  it('should find all ai employee', async () => {
    const aiEmployees = await findAiEmployee.findAll()

    expect(aiEmployees.length).toBe(2)
  })
})

