import { userRepositoryArray } from '../../../infrastucture/db/user/repositories/user.repository.array';
import { User } from '../../entitis/user/user.entity';
import { AddUserPropDto } from '../../repositories/user/dto/add.user.dto';
import { ReturnUserDto } from '../../repositories/user/dto/return.user.dto';
import { UserRepository } from '../../repositories/user/user.repository';

export class UserService {
	constructor(readonly userRepository: UserRepository) {}
	public add = async (dto: AddUserPropDto): Promise<ReturnUserDto> => {
		return await this.userRepository.create(dto);
	};

	public remove = async (id: string): Promise<boolean> => {
		return await this.userRepository.delete(id);
	};

	public getAll = async (): Promise<ReturnUserDto[]> => {
		return await this.userRepository.readAll();
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

	public getIdFromPathname = (pathname: string): string => {
		const regex = /^\/users\/([^/]+)/;
		const match = pathname.match(regex);
		return match ? match[1] : '';
	};
}

export const userService = new UserService(userRepositoryArray);
