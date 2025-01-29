import { IUser } from '../entities/User';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository';
import { UpdateUser } from '../usecases/updateUser';

describe('UpdateUser', () => {
  let updateUser: UpdateUser;
  let userRepository: InMemoryUserRepository;
  let createdUser: IUser

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    updateUser = new UpdateUser(userRepository);
    createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
    });
  });

  it('should update a new user', async () => {
    const request = {
      email: 'johndoe@example.com',
    };

    const response = await updateUser.execute(createdUser.id.toString(), request);

    expect(response.id).toBeDefined();
    expect(response.name).toBe('John Doe');
    expect(response.email).toBe(request.email);
    expect(response.avatarUrl).toBeDefined();


    const user = await userRepository.findById(response.id);
    expect(user).toBeDefined();
    expect(user?.name).toBe('John Doe');
    expect(user?.email).toBe(request.email);
    expect(user?.avatarUrl).toBeDefined();
  });
});
