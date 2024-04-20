import { App } from './app';
import { userController } from './user/user.controller';
import { productController } from './product/product.controller';

async function bootstrap() {
	const app = new App(userController, productController);
	await app.init();
}

export const boot = bootstrap();
