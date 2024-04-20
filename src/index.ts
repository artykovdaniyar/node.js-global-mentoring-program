import { App } from './app';
import { userController } from './user/user.controller';
import { productController } from './product/product.controller';
import { cartController } from './cart/cart.controller';

async function bootstrap() {
	const app = new App(userController, productController, cartController);
	await app.init();
}

export const boot = bootstrap();
