import { userController } from './api/user';
import { App } from './app';

async function bootstrap() {
	const app = new App(userController);
	await app.init();
}

export const boot = bootstrap();
