import express, { Express } from 'express';
import { Server } from 'http';
import { json } from 'body-parser';
import { UserController } from './user/user.controller';
import { ProductController } from './product/product.controller';
import { CartController } from './cart/cart.controller';
import { MongoDBService } from './database/mongodb-service';

export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		private userController: UserController,
		private productController: ProductController,
		private cartController: CartController,
		private dbService: MongoDBService,
	) {
		this.app = express();
		this.port = 8000;
	}

	private connectDB = async () => {
		return await this.dbService.connect();
	};

	private useMiileware(): void {
		this.app.use(json());
	}

	private useRoutes(): void {
		this.app.use('/api/users', this.userController.router);
		this.app.use('/api/products', this.productController.router);
		this.app.use('/api/profile/cart', this.cartController.router);
	}

	public async init(): Promise<void> {
		await this.connectDB();
		this.useMiileware();
		this.useRoutes();
		this.server = this.app.listen(this.port);
		console.log(`Сервер запущен на http://localhost:${this.port}`);
	}

	public close(): void {
		this.server.close();
	}
}
