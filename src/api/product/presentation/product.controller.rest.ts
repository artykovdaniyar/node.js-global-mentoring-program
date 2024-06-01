import { Request, Response } from 'express';
import Joi from 'joi';

import { IProductController } from './product.controller.interface';
import { BaseController } from '../../../common';
import { AuthMiddleware, ValidateMiddleware } from '../../../common/middlewares';
import { productService } from '../service/product.service';
import Product from '../data/product.entity';
import { UserService, userService } from '../../user/service/user.service';
import { HttpStatusCode, IControllerResponse } from '../../../shared';
import { IProductService } from '../service/product.service.interface';

const productSchema = Joi.object({
	title: Joi.string().min(3).max(30).required(),
	description: Joi.string().min(3).max(300).required(),
	price: Joi.number().required(),
});

export class ProductControllerRest extends BaseController implements IProductController {
	constructor(
		private productService: IProductService,
		private userService: UserService,
	) {
		super();
		this.bindRoutes([
			{
				path: '/',
				method: 'get',
				func: this.getAll,
				middlewares: [new AuthMiddleware(this.userService)],
			},
			{
				path: '/:id',
				method: 'get',
				func: this.getOne,
				middlewares: [new AuthMiddleware(this.userService)],
			},
			{
				path: '/',
				method: 'post',
				func: this.add,
				middlewares: [new ValidateMiddleware(productSchema)],
			},
		]);
	}

	public getAll = async (_: Request, res: Response) => {
		let products: Product[] = await this.productService.getAll();

		const response = {
			data: products,
			error: null,
		};
		this.ok(res, response);
	};

	public getOne = async (req: Request, res: Response) => {
		const productId = req.params.id;
		try {
			let product: Product = await this.productService.getOne(productId);

			const response = {
				data: product,
				error: null,
			};
			this.ok(res, response);
		} catch (error) {
			this.error(res, HttpStatusCode.INTERNAL_SERVER_ERROR, error);
		}
	};

	public add = async (req: Request, res: Response) => {
		const { title, description, price } = req.body;

		try {
			const newProduct = await this.productService.add({ title, description, price });

			if (newProduct) {
				const response: IControllerResponse = {
					data: newProduct,
					error: null,
				};
				this.send(res, HttpStatusCode.CREATED, response);
			}
		} catch (error) {
			this.error(res, HttpStatusCode.NOT_FOUND, error);
		}
	};
}

export const productControllerRest = new ProductControllerRest(productService, userService);
