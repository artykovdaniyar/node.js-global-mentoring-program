import User from './user.entity';
import { ReturnUserDto } from './dto/user.return.dto';
import { IUserRepository } from '../shared/user.types';

export class UserMapper {
	constructor() {}

	public toReturnUserArrayDto(data: IUserRepository[]): ReturnUserDto[] {
		return data.map((user) => this.toReturnUserDto(user));
	}

	public toReturnUserDto<T>(data: T): ReturnUserDto {
		const { _id, name, email } = data as IUserRepository;
		return { id: _id, name, email };
	}

	public toDomain(data: IUserRepository): User {
		const { _id, name, email, hobbies } = data;
		return { id: _id, name, email, hobbies };
	}
}

export const userMapper = new UserMapper();
