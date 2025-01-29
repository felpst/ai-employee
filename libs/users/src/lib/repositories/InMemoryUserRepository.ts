import { IUser, User } from '../entities/User';
import { IUserRepository } from './UserRepository';

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  create(data: Partial<IUser>): Promise<IUser> {
    const user = new User(data)
    this.users.push(user);
    return Promise.resolve(user);
  }

  findAll(): Promise<IUser[]> {
    return Promise.resolve(this.users);
  }

  findById(id: string): Promise<IUser | undefined> {
    const user = this.users.find(u => u.id === id);
    return Promise.resolve(user);
  }

  findByEmail(email: string): Promise<IUser | undefined> {
    const user = this.users.find(u => u.email === email);
    return Promise.resolve(user);
  }

  update(id: string, data: Partial<IUser>): Promise<IUser> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      return Promise.reject(new Error('User not found'));
    }
    const updatedUser = { ...this.users[index], ...data };
    this.users[index] = updatedUser as User;
    return Promise.resolve(updatedUser);
  }

  delete(id: string): Promise<void> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      return Promise.reject(new Error('User not found'));
    }
    const deletedUser = this.users.splice(index, 1)[0];
    Promise.resolve(deletedUser);
  }
}
