import { IUserRepository } from "../repositories/UserRepository";

interface CreateUserResponse {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export class FindUser {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async byId(id: string): Promise<CreateUserResponse> {

    const user = await this.userRepository.findById(id);
    
    // Check if user exists
    if (!user) {
      throw new Error('User not exists');
    }

    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    };
  }

  async byEmail(email: string): Promise<CreateUserResponse> {

    const user = await this.userRepository.findByEmail(email);
    
    // Check if user exists
    if (!user) {
      throw new Error('User not exists');
    }

    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    };
  }

  async all(): Promise<CreateUserResponse[]> {

    const findUsers = await this.userRepository.findAll();
    
    // Check if user exists
    if (!findUsers || findUsers.length <= 0) {
      throw new Error('User not exists');
    }

    const users = findUsers.map(user => {
      return {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      }
    })

    return users;
  }
}
