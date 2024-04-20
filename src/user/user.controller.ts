import { Request, Response } from 'express';
import { BaseController } from '../common';
import { HttpStatusCode, IControllerResponse } from '../shared';
import { UserService, userService } from './user.service';
import { AdminMiddleware } from '../middleware/admin.middleware';
import { AuthMiddleware } from '../middleware/auth.middleware';

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
				middlewares: [new AdminMiddleware()],
			},

			{
				path: '/:id',
				method: 'delete',
				func: this.remove,
				middlewares: [new AdminMiddleware()],
			},
			{
				path: '/:id/hobbies',
				method: 'get',
				func: this.getHobbies,
				middlewares: [new AuthMiddleware(this.userService)],
			},
			{
				path: '/:id/hobbies',
				method: 'patch',
				func: this.updateHobbies,
				middlewares: [new AuthMiddleware(this.userService)],
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

	private remove = async (req: Request, res: Response) => {
		const userId = req.params.id;
		try {
			await this.userService.remove(userId);
			const response = {
				data: {
					success: true,
				},
				error: null,
			};
			this.ok(res, response);
		} catch (error) {
			this.error(res, HttpStatusCode.NOT_FOUND, error);
		}
	};

	private getHobbies = async (req: Request, res: Response) => {
		const userId = req.params.id;
		try {
			const hobbies = await this.userService.getHobbies(userId);
			const response = {
				data: {
					hobbies,
					links: {
						self: `/api/users/${userId}/hobbies`,
						user: `/api/users/${userId}`,
					},
				},
				error: null,
			};
			this.ok(res, response);
		} catch (error) {
			this.error(res, HttpStatusCode.NOT_FOUND, error);
		}
	};

	private updateHobbies = async (req: Request, res: Response) => {
		const { hobbies } = req.body;
		const userId = req.params.id;
		try {
			const user = await this.userService.updateHobbies(userId, hobbies);
			const response = {
				data: {
					user,
					links: {
						self: `/api/users/${user.id}`,
						hobbies: `/api/users/${user.id}/hobbies`,
					},
				},
				error: null,
			};
			this.ok(res, response);
		} catch (error) {
			this.error(res, HttpStatusCode.NOT_FOUND, error);
		}
	};
}

export const userController = new UserController(userService);
