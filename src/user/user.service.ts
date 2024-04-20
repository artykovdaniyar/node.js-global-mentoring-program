import { AddUserPropDto, ReturnUserDto } from './dto/index';
import { UserRepository } from './user.repository';
import { userRepositoryArray } from './user.repository.array';

export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	public add = async (dto: AddUserPropDto): Promise<ReturnUserDto> => {
		return await this.userRepository.create(dto);
	};

	public remove = async (id: string): Promise<boolean> => {
		return await this.userRepository.delete(id);
	};

	public getAll = async (): Promise<ReturnUserDto[]> => {
		return await this.userRepository.readAll();
	};
}

export const userService = new UserService(userRepositoryArray);
