import { v4 as uuidv4 } from 'uuid';
import { usersData } from './userData';
import { UserRepository } from './user.repository';
import { ReturnUserDto } from './dto';

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
}

export const userRepositoryArray = new UserRepositoryArray();
