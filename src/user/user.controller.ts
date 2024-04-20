import { Request, Response } from 'express';
import { BaseController } from '../common';
import { HttpStatusCode } from '../shared';
import { UserService, userService } from './user.service';

export class UserController extends BaseController {
	constructor(private userService: UserService) {
		super();
		this.bindRoutes([
			{
				path: '/',
				method: 'get',
				func: this.getAll,
			},
		]);
	}

	private getAll = async (_: Request, res: Response) => {
		try {
			let users: any = await this.userService.getAll();
			users = users.map((user) => ({
				user: { ...user },
				links: {
					self: `/api/users/${user.id}`,
					hobbies: `/api/users/${user.id}/hobbies`,
				},
			}));
			const response = {
				data: users,
				error: null,
			};
			this.ok(res, response);
		} catch (error) {
			this.error(res, HttpStatusCode.INTERNAL_SERVER_ERROR, error);
		}
	};
}

export const userController = new UserController(userService);
