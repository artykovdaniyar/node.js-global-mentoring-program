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

	public getOne = async (id: string): Promise<ReturnUserDto> => {
		return await this.userRepository.readOne(id);
	};

	public getHobbies = async (id: string): Promise<string[]> => {
		const user = await this.userRepository.readOne(id);
		return user.hobbies;
	};

	public updateHobbies = async (id: string, hobbies: string[]): Promise<ReturnUserDto> => {
		const userToUpdate = await this.userRepository.readOne(id);
		const updatedUser = { ...userToUpdate, hobbies: [...hobbies] };

		const user = await this.userRepository.update(updatedUser);
		return user;
	};
}

export const userService = new UserService(userRepositoryArray);
