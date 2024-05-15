import { UserRepository } from './user.repository';
import { AddUserPropDto, ReturnUserDto, UpdateUserDto } from '../dto';
import User from '../user.entity';
import UserModel from '../user.model';
import { UserMapper, userMapper } from '../user.mapper';
import { IUserRepository } from '../../shared/user.types';
import { HTTPError } from '../../../../shared/entities/http-error.entity';
import { HttpStatusCode } from '../../../../shared';

export class UserRepositoryMongoDb implements UserRepository {
	constructor(private userMapper: UserMapper) {}

	public async create(dto: AddUserPropDto): Promise<ReturnUserDto> {
		try {
			const newUser = await UserModel.create({ name: dto.name, email: dto.email });
			return this.userMapper.toReturnUserDto(newUser);
		} catch (error: any) {
			if (error.code === 11000) {
				throw new HTTPError(HttpStatusCode.CONFLICT, `User already exist`);
			} else {
				throw new HTTPError(HttpStatusCode.INTERNAL_SERVER_ERROR, error.message);
			}
		}
	}

	public async readAll(): Promise<ReturnUserDto[]> {
		const result: IUserRepository[] = await UserModel.find().lean();
		if (!result) {
			throw new HTTPError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'No users found');
		}

		return this.userMapper.toReturnUserArrayDto(result);
	}

	public readOne = async (id: string): Promise<User> => {
		const result: IUserRepository | null = await UserModel.findOne({ _id: id });
		if (!result) {
			throw new HTTPError(HttpStatusCode.NOT_FOUND, `User with id ${id} doesn't exist`);
		}

		return this.userMapper.toDomain(result);
	};

	public delete = async (id: string): Promise<boolean> => {
		const result = await UserModel.deleteOne({ _id: id });
		if (result.deletedCount === 0) {
			throw new HTTPError(HttpStatusCode.NOT_FOUND, `User with id ${id} not found`);
		}

		return result.acknowledged && result.deletedCount === 1;
	};

	public async update(dto: UpdateUserDto): Promise<ReturnUserDto> {
		let result: IUserRepository | null = await UserModel.findOneAndUpdate({ _id: dto.id }, dto);

		if (!result) {
			throw new HTTPError(HttpStatusCode.NOT_FOUND, `User with ID ${dto.id} does not exist.`);
		}

		return this.userMapper.toReturnUserDto(result);
	}
}

export const userRepositoryMongoDb = new UserRepositoryMongoDb(userMapper);
