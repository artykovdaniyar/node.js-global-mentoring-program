import { Request, Response } from 'express';
import Joi from 'joi';

import { BaseController } from '../../../common';
import { CartService, cartService } from '../service/cart.service';
import { HttpStatusCode } from '../../../shared';
import { AuthMiddleware, ValidateMiddleware } from '../../../common/middlewares';
import { UserService, userService } from '../../user/service/user.service';
import { ICartController } from './cart.controller.interface';

const cartUpdateSchema = Joi.object({
	productId: Joi.string().uuid().required(),
	count: Joi.number().integer().required(),
});

const cartCheckoutSchema = Joi.object({
	payment: Joi.object({
		type: Joi.string().required(),
		address: Joi.string(),
		creditCard: Joi.string(),
	}),
	delivery: Joi.object({
		type: Joi.string().required(),
		address: Joi.string(),
	}),
	comments: Joi.string().min(0).max(600),
});

export class CartControllerRest extends BaseController implements ICartController {
	constructor(
		private userService: UserService,
		private cartService: CartService,
	) {
		super();
		this.bindRoutes([
			{
				path: '/',
				method: 'get',
				func: this.getOne,
				middlewares: [new AuthMiddleware(this.userService)],
			},

			{
				path: '/',
				method: 'put',
				func: this.update,
				middlewares: [
					new ValidateMiddleware(cartUpdateSchema),
					new AuthMiddleware(this.userService),
				],
			},

			{
				path: '/',
				method: 'delete',
				func: this.empty,
				middlewares: [new AuthMiddleware(this.userService)],
			},

			{
				path: '/checkout',
				method: 'post',
				func: this.checkout,
				middlewares: [
					new ValidateMiddleware(cartCheckoutSchema),
					new AuthMiddleware(this.userService),
				],
			},
		]);
	}

	public getOne = async (req: Request, res: Response): Promise<void> => {
		try {
			const userId = req.headers['x-user-id'] as string;
			const cart = await this.cartService.getById(userId);
			const response = {
				data: {
					...cart,
				},
				error: null,
			};
			this.ok(res, response);
		} catch (error) {
			this.error(res, HttpStatusCode.INTERNAL_SERVER_ERROR, error);
		}
	};

	public update = async (req: Request, res: Response) => {
		try {
			const userId = req.headers['x-user-id'] as string;
			const { productId, count } = req.body;

			const cart = await this.cartService.update({ userId, productId, count });
			const response = {
				data: {
					...cart,
				},
				error: null,
			};
			this.ok(res, response);
		} catch (error) {
			this.error(res, HttpStatusCode.INTERNAL_SERVER_ERROR, error);
		}
	};

	public empty = async (req: Request, res: Response) => {
		try {
			const userId = req.headers['x-user-id'] as string;

			await this.cartService.empty(userId);
			const response = {
				data: {
					success: true,
				},
				error: null,
			};
			this.ok(res, response);
		} catch (error) {
			this.error(res, HttpStatusCode.INTERNAL_SERVER_ERROR, error);
		}
	};

	public checkout = async (req: Request, res: Response) => {
		try {
			const userId = req.headers['x-user-id'] as string;
			const { payment, delivery, comments } = req.body;
			const order = await this.cartService.checkout({ userId, payment, delivery, comments });

			const response = {
				data: {
					order,
				},
				error: null,
			};
			this.ok(res, response);
		} catch (error) {
			this.error(res, HttpStatusCode.BAD_REQUEST, error);
		}
	};
}

export const cartControllerRest = new CartControllerRest(userService, cartService);
