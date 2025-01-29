import { User } from "../entities/User";
import { IUserRepository } from "../repositories/UserRepository";

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

interface CreateUserResponse {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export class CreateUser {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {

    // Check if user already exists
    const userAlreadyExists = await this.userRepository.findByEmail(request.email);
    if (userAlreadyExists) {
      throw new Error('User already exists');
    }

    // Create new user entity
    const user = new User(request);

    // Save user
    const savedUser = await this.userRepository.create(user);

    return {
      id: savedUser.id.toString(),
      name: savedUser.name,
      email: savedUser.email,
      avatarUrl: savedUser.avatarUrl,
    };
  }
}
