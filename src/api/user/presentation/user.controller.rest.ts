import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { BaseController } from '../../../common';
import { userService } from '../service/user.service';
import { IUserService } from '../service/user.service.interface';
import { IUserController } from './user.controller.interface';
import { HttpStatusCode, IControllerResponse } from '../../../shared';
import { AuthMiddleware, AdminMiddleware, ValidateMiddleware } from '../../../common/middlewares';
import { ReturnUserDto } from '../data/dto';

const userSchema = Joi.object({
	name: Joi.string().min(3).max(30).required(),
	email: Joi.string().email().required(),
});

const userIdSchema = Joi.object({
	id: Joi.string().uuid().required(),
});

const userHobbiesSchema = Joi.object({
	hobbies: Joi.array().items(Joi.string()).required(),
});

export class UserControllerRest extends BaseController implements IUserController {
	constructor(private userService: IUserService) {
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
				middlewares: [new ValidateMiddleware(userSchema)],
			},

			{
				path: '/:id',
				method: 'delete',
				func: this.remove,
				middlewares: [new ValidateMiddleware(userIdSchema, 'params'), new AdminMiddleware()],
			},
			{
				path: '/:id/hobbies',
				method: 'get',
				func: this.getHobbies,
				middlewares: [
					new ValidateMiddleware(userIdSchema, 'params'),
					new AuthMiddleware(this.userService),
				],
			},
			{
				path: '/:id/hobbies',
				method: 'patch',
				func: this.updateHobbies,
				middlewares: [
					new ValidateMiddleware(userHobbiesSchema),
					new AuthMiddleware(this.userService),
				],
			},
		]);
	}

	public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		let users: ReturnUserDto[] = await this.userService.getAll();

		const data = users.map((user) => ({
			user: { ...user },
			links: {
				self: `/api/users/${user.id}`,
				hobbies: `/api/users/${user.id}/hobbies`,
			},
		}));

		const response = {
			data,
			error: null,
		};
		this.ok(res, response);
	};

	public add = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const { name, email } = req.body;

		const user = await this.userService.add({ name, email });

		if (user) {
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
		}
	};

	public remove = async (req: Request, res: Response) => {
		const userId = req.params.id;
		try {
			const result = await this.userService.remove(userId);
			const response = {
				data: {
					success: result,
				},
				error: null,
			};
			this.ok(res, response);
		} catch (error) {
			this.error(res, HttpStatusCode.NOT_FOUND, error);
		}
	};

	public getHobbies = async (req: Request, res: Response) => {
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

	public updateHobbies = async (req: Request, res: Response) => {
		const { hobbies } = req.body;
		const userId = req.params.id;

		try {
			const user = await this.userService.updateHobbies(userId, hobbies);
			if (user) {
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
			}
		} catch (error) {
			this.error(res, HttpStatusCode.NOT_FOUND, error);
		}
	};
}

export const userControllerRest = new UserControllerRest(userService);
