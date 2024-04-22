import { v4 as uuidv4 } from 'uuid';
import { usersData } from './userData';
import { UserRepository } from './user.repository';
import { AddUserPropDto, ReturnUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';

export class UserRepositoryArray implements UserRepository {
	public readAll = async (): Promise<ReturnUserDto[]> => {
		return new Promise((resolve, reject) => {
			if (Array.isArray(usersData)) {
				resolve(usersData.map(({ name, email, id }) => ({ name, email, id })));
			} else {
				reject(new Error('Users not Found'));
			}
		});
	};

	public readOne = async (id: string): Promise<User> => {
		return new Promise((resolve, reject) => {
			const indexOfUser = usersData.findIndex((user) => user.id === id);
			if (indexOfUser !== -1) {
				resolve(usersData[indexOfUser]);
			} else {
				reject(new Error(`User with id ${id} doesn't exist`));
			}
		});
	};

	public create = async (dto: AddUserPropDto): Promise<ReturnUserDto> => {
		return new Promise((resolve, reject) => {
			const indexOfDublicate = usersData.findIndex(
				(user) => user.name === dto.name && user.email === dto.email,
			);

			if (indexOfDublicate === -1) {
				const newUser: ReturnUserDto = { ...dto, id: uuidv4() };
				usersData.push({ ...newUser, hobbies: [] });
				resolve(newUser);
			} else {
				reject(new Error(`User with name ${dto.name} and email ${dto.email} already exist`));
			}
		});
	};

	public delete = async (id: string): Promise<boolean> => {
		return new Promise((resolve, reject) => {
			const indexToDelete = usersData.findIndex((user) => user.id === id);
			if (indexToDelete !== -1) {
				usersData.splice(indexToDelete, 1);
				resolve(true);
			} else {
				reject(new Error(`User with id ${id} doesn't exist`));
			}
		});
	};

	public update = async (dto: UpdateUserDto): Promise<ReturnUserDto> => {
		return new Promise((resolve, reject) => {
			const indexToUpdate = usersData.findIndex((user) => user.id === dto.id);
			if (indexToUpdate !== -1) {
				const updatedUser = { ...usersData[indexToUpdate], ...dto };
				usersData[indexToUpdate] = updatedUser;
				const { name, email, id } = updatedUser;

				resolve({ name, email, id });
			} else {
				reject(new Error(`User with id ${dto.id} doesn't exist`));
			}
		});
	};
}

export const userRepositoryArray = new UserRepositoryArray();
