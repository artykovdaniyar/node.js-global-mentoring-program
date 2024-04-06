import { User } from '../../entitis/user/user.entity';
import { AddUserPropDto } from './dto/add.user.dto';
import { ReturnUserDto } from './dto/return.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

export interface UserRepository {
	create: (dto: AddUserPropDto) => Promise<ReturnUserDto>;
	readAll: () => Promise<ReturnUserDto[]>;
	readOne: (id: string) => Promise<User>;
	update: (dto: UpdateUserDto) => Promise<ReturnUserDto>;
	delete: (id: string) => Promise<boolean>;
}
