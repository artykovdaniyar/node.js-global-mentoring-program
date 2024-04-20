import { UserController } from './api/user';
import express, { Express } from 'express';
import { Server } from 'http';

export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(private userController: UserController) {
		this.app = express();
		this.port = 8000;
	}

	useRoutes(): void {
		this.app.use('/user', this.userController.router);
	}

	public async init(): Promise<void> {
		this.useRoutes();
		this.server = this.app.listen(this.port);
		console.log(`Сервер запущен на http://localhost:${this.port}`);
	}

	public close(): void {
		this.server.close();
	}
}
