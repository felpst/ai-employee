import { IUserRepository } from "../repositories/UserRepository";

export class DeleteUser {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
