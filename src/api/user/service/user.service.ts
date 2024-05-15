import { AddUserPropDto, ReturnUserDto } from '../data/dto/index';
import { UserRepository } from '../data/repositories/user.repository';
import { userRepositoryMongoDb } from '../data/repositories/user.repository.mongodb';
import { IUserService } from './user.service.interface';

export class UserService implements IUserService {
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
		return user && user.hobbies;
	};

	public updateHobbies = async (
		id: string,
		hobbies: string[],
	): Promise<ReturnUserDto | undefined> => {
		const userToUpdate = await this.userRepository.readOne(id);
		if (userToUpdate) {
			const { name, email, id } = userToUpdate;
			const updatedUser = { name, email, id, hobbies: [...hobbies] };

			const result = await this.userRepository.update(updatedUser);
			return result ? result : undefined;
		}
	};
}

export const userService = new UserService(userRepositoryMongoDb);
