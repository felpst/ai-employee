import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository';
import { CreateUser } from '../usecases/createUser';

describe('CreateUser', () => {
  let createUser: CreateUser;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    createUser = new CreateUser(userRepository);
  });

  it('should create a new user', async () => {
    const request = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
    };

    const response = await createUser.execute(request);

    expect(response.id).toBeDefined();
    expect(response.name).toBe(request.name);
    expect(response.email).toBe(request.email);
    expect(response.avatarUrl).toBeDefined();

    const user = await userRepository.findById(response.id);
    expect(user).toBeDefined();
    expect(user?.name).toBe(request.name);
    expect(user?.email).toBe(request.email);
    expect(user?.avatarUrl).toBeDefined();
  });

  it('should throw an error if email is already in use', async () => {
    const existingUser = {
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: 'password',
    };
    await userRepository.create(existingUser);

    const request = {
      name: 'John Doe',
      email: existingUser.email,
      password: 'password',
    };

    await expect(createUser.execute(request)).rejects.toThrowError(
      'User already exists',
    );
  });
});
