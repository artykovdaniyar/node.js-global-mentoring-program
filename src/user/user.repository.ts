import { ReturnUserDto } from './dto';
import { User } from './user.entity';

export interface UserRepository {
	readAll: () => Promise<ReturnUserDto[]>;
}
