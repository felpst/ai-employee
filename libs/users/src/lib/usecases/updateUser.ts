import { UserDTO } from "../entities/User";
import { IUserRepository } from "../repositories/UserRepository";

interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
}

interface UpdateUserResponse {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export class UpdateUser {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: string, data: UpdateUserRequest): Promise<UpdateUserResponse> {

    // Update new user entity
    const user = new UserDTO(data);

    // Save user
    const updatedUser = await this.userRepository.update(id, user);

    return {
      id: updatedUser.id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      avatarUrl: updatedUser.avatarUrl,
    };
  }
}
