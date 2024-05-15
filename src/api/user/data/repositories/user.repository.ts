import { AddUserPropDto, ReturnUserDto, UpdateUserDto } from '../dto';
import User from '../user.entity';

export interface UserRepository {
	create: (dto: AddUserPropDto) => Promise<ReturnUserDto>;
	readAll: () => Promise<ReturnUserDto[]>;
	readOne: (id: string) => Promise<User>;
	update: (dto: UpdateUserDto) => Promise<ReturnUserDto>;
	delete: (id: string) => Promise<boolean>;
}
