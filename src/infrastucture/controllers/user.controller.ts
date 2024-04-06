import { IncomingMessage, ServerResponse } from 'http';
import { BaseController } from '../../common/base.controller';
import { UserService, userService } from '../../core/services/user/user.service';
import { User } from '../../core/entitis/user/user.entity';
import { IControllerResponse } from '../../share/typings/controller.types';

export class UserController extends BaseController {
	constructor(private userService: UserService) {
		super();
		this.bindRoutes([
			{
				method: 'GET',
				controller: this.getAll,
				pattern: '^/users/?$',
			},
			{
				method: 'POST',
				controller: this.add,
				pattern: '^/users/?$',
			},
			{
				method: 'DELETE',
				controller: this.remove,
				pattern: '^/users/[^/]+/?$',
			},
			{
				method: 'GET',
				controller: this.getHobbies,
				pattern: '^/users/[^/]+/hobbies/?$',
			},
			{
				method: 'PATCH',
				controller: this.updateHobbies,
				pattern: '^/users/[^/]+/hobbies/?$',
			},
		]);
	}

	private add = async (req: IncomingMessage, res: ServerResponse) => {
		try {
			const { name, email } = await this.parseRequestBody<User>(req);
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
			this.handleSuccessResponse(res, response, 201);
		} catch (error) {
			this.handleFailResponse(res, 404, error);
		}
	};

	private remove = async (_: IncomingMessage, res: ServerResponse, pathname: string = '') => {
		const id = this.userService.getIdFromPathname(pathname);

		try {
			await this.userService.remove(id);
			const response = {
				data: {
					success: true,
				},
				error: null,
			};

			this.handleSuccessResponse(res, response);
		} catch (error) {
			this.handleFailResponse(res, 404, error);
		}
	};

	private getAll = async (_: IncomingMessage, res: ServerResponse) => {
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

			this.handleSuccessResponse(res, response);
		} catch (error) {
			this.handleFailResponse(res, 500, error);
		}
	};

	private getHobbies = async (_: IncomingMessage, res: ServerResponse, pathname: string = '') => {
		const id = this.userService.getIdFromPathname(pathname);

		try {
			const hobbies = await this.userService.getHobbies(id);

			const response = {
				data: {
					hobbies,
					links: {
						self: `/api/users/${id}/hobbies`,
						user: `/api/users/${id}`,
					},
				},
				error: null,
			};

			this.handleSuccessResponse(res, response);
		} catch (error) {
			this.handleFailResponse(res, 404, error);
		}
	};

	private updateHobbies = async (
		req: IncomingMessage,
		res: ServerResponse,
		pathname: string = '',
	) => {
		const { hobbies } = await this.parseRequestBody<User>(req);

		try {
			const id = this.userService.getIdFromPathname(pathname);
			const user = await this.userService.updateHobbies(id, hobbies);

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
			this.handleSuccessResponse(res, response);
		} catch (error) {
			this.handleFailResponse(res, 404, error);
		}
	};
}

export const userController = new UserController(userService);
