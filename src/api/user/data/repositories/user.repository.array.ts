import { v4 as uuidv4 } from 'uuid';
import { usersData } from '../usersData';
import { UserRepository } from './user.repository';
import { AddUserPropDto, ReturnUserDto, UpdateUserDto } from '../dto';
import User from '../user.entity';
import { UserMapper, userMapper } from '../user.mapper';
import { IUserRepository } from '../../shared/user.types';
import { HTTPError } from '../../../../shared/entities/http-error.entity';
import { HttpStatusCode } from '../../../../shared';

export class UserRepositoryArray implements UserRepository {
	constructor(private userMapper: UserMapper) {}

	public create = async (dto: AddUserPropDto): Promise<ReturnUserDto> => {
		return new Promise((resolve, reject) => {
			const indexOfDublicate = usersData.findIndex(
				(user) => user.name === dto.name && user.email === dto.email,
			);

			if (indexOfDublicate === -1) {
				const newUser: IUserRepository = {
					...dto,
					_id: uuidv4(),
					hobbies: [],
				};
				usersData.push(newUser);
				resolve(this.userMapper.toReturnUserDto(newUser));
			} else {
				reject(new HTTPError(HttpStatusCode.CONFLICT, `User already exist`));
			}
		});
	};

	public readAll = async (): Promise<ReturnUserDto[]> => {
		return new Promise((resolve, reject) => {
			if (Array.isArray(usersData)) {
				resolve(usersData.map(({ name, email, _id }) => ({ name, email, id: _id })));
			} else {
				reject(new HTTPError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'No users found'));
			}
		});
	};

	public readOne = async (id: string): Promise<User> => {
		return new Promise((resolve, reject) => {
			const indexOfUser = usersData.findIndex((user) => user._id === id);
			if (indexOfUser === -1) {
				reject(new HTTPError(HttpStatusCode.NOT_FOUND, `User with id ${id} doesn't exist`));
			}
			const user = this.userMapper.toDomain(usersData[indexOfUser]);
			resolve(user);
		});
	};

	public delete = async (id: string): Promise<boolean> => {
		return new Promise((resolve, reject) => {
			const indexToDelete = usersData.findIndex((user) => user._id === id);
			if (indexToDelete !== -1) {
				usersData.splice(indexToDelete, 1);
				resolve(true);
			} else {
				reject(new HTTPError(HttpStatusCode.NOT_FOUND, `User with id ${id} doesn't exist`));
			}
		});
	};

	public update = async (dto: UpdateUserDto): Promise<ReturnUserDto> => {
		return new Promise((resolve, reject) => {
			const indexToUpdate = usersData.findIndex((user) => user._id === dto.id);
			if (indexToUpdate !== -1) {
				const updatedUser = { ...usersData[indexToUpdate], ...dto };
				usersData[indexToUpdate] = updatedUser;

				resolve(this.userMapper.toReturnUserDto(updatedUser));
			} else {
				reject(new HTTPError(HttpStatusCode.NOT_FOUND, `User with id ${dto.id} doesn't exist`));
			}
		});
	};
}

export const userRepositoryArray = new UserRepositoryArray(userMapper);
