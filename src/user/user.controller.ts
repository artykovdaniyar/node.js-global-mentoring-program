import { Request, Response } from 'express';
import { BaseController } from '../common';
import { HttpStatusCode, IControllerResponse } from '../shared';
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
			{
				path: '/',
				method: 'post',
				func: this.add,
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

	private add = async (req: Request, res: Response) => {
		try {
			const { name, email } = req.body;

			const user = await this.userService.add({ name, email });
			const response: IControllerResponse = {
				data: {
					user,
					links: {
						self: `/api/users/${user.id}`,
						hobbies: `/api/users/${user.id}/hobbies`,
					},
				},
				error: null,
			};
			this.send(res, HttpStatusCode.CREATED, response);
		} catch (error) {
			this.error(res, HttpStatusCode.NOT_FOUND, error);
		}
	};
}

export const userController = new UserController(userService);
