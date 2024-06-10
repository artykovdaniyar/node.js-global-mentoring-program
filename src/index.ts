import { App } from './app';
import dotenv from 'dotenv';
import { userControllerRest } from './api/user/presentation/user.controller.rest';
import { productControllerRest } from './api/product/presentation/product.controller.rest';
import { cartControllerRest } from './api/cart/presentation/cart.controller.rest';
import { dbServiceMongoDB } from './database/db.service.mongodb';

async function bootstrap() {
	dotenv.config();
	const app = new App(
		userControllerRest,
		productControllerRest,
		cartControllerRest,
		dbServiceMongoDB,
	);
	await app.init();
}

export const boot = bootstrap();
