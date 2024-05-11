import { App } from './app';
import { userController } from './user/user.controller';
import { productController } from './product/product.controller';
import { cartController } from './cart/cart.controller';
import { mongoDBService } from './database/mongodb-service';

async function bootstrap() {
	const app = new App(userController, productController, cartController, mongoDBService);
	await app.init();
}

export const boot = bootstrap();
