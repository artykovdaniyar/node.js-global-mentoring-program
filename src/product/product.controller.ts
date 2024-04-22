import { Request, Response } from 'express';
import { BaseController } from '../common';
import { AuthMiddleware } from '../middleware';
import { ProductService, productService } from './product.service';
import { Product } from './product.entity';
import { UserService, userService } from '../user/user.service';
import { HttpStatusCode } from '../shared';

export class ProductController extends BaseController {
	constructor(
		private productService: ProductService,
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
		]);
	}

	private getAll = async (_: Request, res: Response) => {
		try {
			let products: Product[] = await this.productService.getAll();

			const response = {
				data: products,
				error: null,
			};
			this.ok(res, response);
		} catch (error) {
			this.error(res, HttpStatusCode.INTERNAL_SERVER_ERROR, error);
		}
	};

	private getOne = async (req: Request, res: Response) => {
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
}

export const productController = new ProductController(productService, userService);
