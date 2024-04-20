import { userController } from './user/user.controller';
import { App } from './app';

async function bootstrap() {
	const app = new App(userController);
	await app.init();
}

export const boot = bootstrap();
