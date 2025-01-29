import { IUser } from '../entities/User';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository';
import { DeleteUser } from '../usecases/deleteUser';

describe('DeleteUser', () => {
  let deleteUser: DeleteUser;
  let userRepository: InMemoryUserRepository;
  let createdUser: IUser

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    deleteUser = new DeleteUser(userRepository);
    createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
    });
  });

  it('should delete a new user', async () => {
    await deleteUser.execute(createdUser.id.toString());
    const user = await userRepository.findById(createdUser.id.toString())

    expect(user).toBe(undefined)
  });
});
