import { ReturnUserDto } from './dto/index';
import { UserRepository } from './user.repository';
import { userRepositoryArray } from './user.repository.array';

export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	public getAll = async (): Promise<ReturnUserDto[]> => {
		return await this.userRepository.readAll();
	};
}

export const userService = new UserService(userRepositoryArray);
