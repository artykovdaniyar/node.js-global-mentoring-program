import { AddUserPropDto, ReturnUserDto } from '../data/dto';

export interface IUserService {
	add(dto: AddUserPropDto): Promise<ReturnUserDto>;
	remove(id: string): Promise<boolean>;
	getAll(): Promise<ReturnUserDto[]>;
	getOne(id: string): Promise<ReturnUserDto>;
	getHobbies(id: string): Promise<string[]>;
	updateHobbies(id: string, hobbies: string[]): Promise<ReturnUserDto | undefined>;
}
