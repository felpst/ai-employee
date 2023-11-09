import { IUser } from '../entities/User';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository';
import { FindUser } from '../usecases/findUser';

describe('FindUser', () => {
  let findUser: FindUser;
  let userRepository: InMemoryUserRepository;
  let createdUser: IUser

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    findUser = new FindUser(userRepository);
    createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
    });
  });

  it('should find a user by id', async () => {
    const response = await findUser.byId(createdUser.id.toString());

    expect(response.id).toBeDefined();
    expect(response.name).toBe('John Doe');
    expect(response.email).toBe('john@example.com');
    expect(response.avatarUrl).toBeDefined();
  })

  it('should find a user by email', async () => {
    const response = await findUser.byEmail(createdUser.email);

    expect(response.id).toBeDefined();
    expect(response.name).toBe('John Doe');
    expect(response.email).toBe('john@example.com');
    expect(response.avatarUrl).toBeDefined();
  })

  it('should find all users', async () => {
    const response = await findUser.all();

    expect(response.length).toBeGreaterThan(0);
  })

  it('should throw an error if user not found', async () => {
    await expect(findUser.byId('123')).rejects.toThrowError('User not exists');
  })

  it('should throw an error if user not found', async () => {
    await expect(findUser.byEmail('123')).rejects.toThrowError('User not exists');
  })

  it('should throw an error if user not found', async () => {
    await userRepository.delete(createdUser.id.toString());

    await expect(findUser.all()).rejects.toThrowError('User not exists');
  })
});
