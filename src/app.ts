import express, { Express } from 'express';
import { json } from 'body-parser';
import { Server } from 'http';
import { UserController } from './user/user.controller';

export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(private userController: UserController) {
		this.app = express();
		this.port = 8000;
	}

	useMiileware(): void {
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.use('/api/users', this.userController.router);
	}

	public async init(): Promise<void> {
		this.useMiileware();
		this.useRoutes();
		this.server = this.app.listen(this.port);
		console.log(`Сервер запущен на http://localhost:${this.port}`);
	}

	public close(): void {
		this.server.close();
	}
}
