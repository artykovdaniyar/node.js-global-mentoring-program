import { Request, Response } from 'express';
import Joi from 'joi';
import { BaseController } from '../common';
import { CartService, cartService } from './cart.service';
import { HttpStatusCode } from '../shared';
import { AuthMiddleware, ValidateMiddleware } from '../middleware';
import { UserService, userService } from '../user/user.service';

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

export class CartController extends BaseController {
	constructor(
		private userService: UserService,
		private cartService: CartService,
	) {
		super();
		this.bindRoutes([
			{
				path: '/',
				method: 'get',
				func: this.getUserCart,
				middlewares: [new AuthMiddleware(this.userService)],
			},

			{
				path: '/',
				method: 'put',
				func: this.updateUserCart,
				middlewares: [
					new ValidateMiddleware(cartUpdateSchema),
					new AuthMiddleware(this.userService),
				],
			},

			{
				path: '/',
				method: 'delete',
				func: this.emptyUserCart,
				middlewares: [new AuthMiddleware(this.userService)],
			},
		]);
	}

	private getUserCart = async (req: Request, res: Response) => {
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

	private updateUserCart = async (req: Request, res: Response) => {
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

	private emptyUserCart = async (req: Request, res: Response) => {
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
}

export const cartController = new CartController(userService, cartService);
