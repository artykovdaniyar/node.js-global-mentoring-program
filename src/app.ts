import express, { Express } from 'express';
import { Server } from 'http';
import { json } from 'body-parser';

import { IUserController } from './api/user/presentation/user.controller.interface';
import { IProductController } from './api/product/presentation/product.controller.interface';
import { ICartController } from './api/cart/presentation/cart.controller.interface';
import { IDBService } from './database/db.service.interface';
import { errorHandlerMiddleware } from './common/middlewares/error-handler.middleware';

export class App {
	app: Express;
	server: Server;
	port: number;
	domain: string;

	constructor(
		private userController: IUserController,
		private productControllerRest: IProductController,
		private cartControllerRest: ICartController,
		private dbService: IDBService,
	) {
		this.app = express();
		this.port = +process.env.PORT || 8000;
		this.domain = process.env.DOMAIN;
	}

	private connectDB = async () => {
		return await this.dbService.connect();
	};

	private useMiileware(): void {
		this.app.use(json());
	}

	private useRoutes(): void {
		this.app.use('/api/users', this.userController.router);
		this.app.use('/api/products', this.productControllerRest.router);
		this.app.use('/api/profile/cart', this.cartControllerRest.router);
	}

	private useExeption(): void {
		this.app.use(errorHandlerMiddleware.execute);
	}

	public async init(): Promise<void> {
		await this.connectDB();
		this.useExeption();
		this.useMiileware();
		this.useRoutes();

		this.server = this.app.listen(this.port);
		console.log(`Сервер запущен на http://${this.domain}:${this.port}`);
	}

	public async close() {
		await this.dbService.disconnect();
		this.server.close();
	}
}
