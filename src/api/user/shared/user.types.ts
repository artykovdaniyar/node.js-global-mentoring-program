import User from '../data/user.entity';

export interface IUserRepository extends Omit<User, 'id'> {
	_id: string;
}
