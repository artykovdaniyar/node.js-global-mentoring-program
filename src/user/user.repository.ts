import { AddUserPropDto, ReturnUserDto } from './dto';

export interface UserRepository {
	create: (dto: AddUserPropDto) => Promise<ReturnUserDto>;
	readAll: () => Promise<ReturnUserDto[]>;
	delete: (id: string) => Promise<boolean>;
}
