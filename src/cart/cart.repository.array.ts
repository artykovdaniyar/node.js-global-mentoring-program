import { Cart } from './cart.entity';
import { v4 as uuidv4 } from 'uuid';
import { CartRepository } from './cart.repository';
import { cartsData } from './cartsData';
import { AddProductDto } from './dto/cart.addProduct.dto';
import { UpdateCartDto } from './dto/cart.update.dto';

export class CartRepositoryArray implements CartRepository {
	constructor() {}

	public create = async (userId: string): Promise<Cart> => {
		return new Promise((resolve) => {
			const newCart = this.buildCart(userId);
			cartsData.push(newCart);

			resolve(newCart);
		});
	};

	public readAll = async (): Promise<Cart[]> => {
		return new Promise((resolve, reject) => {
			if (Array.isArray(cartsData)) {
				resolve(cartsData);
			} else {
				reject(new Error('Internal Server error'));
			}
		});
	};

	public readOne = async (userId: string): Promise<Cart> => {
		return new Promise(async (resolve, reject) => {
			const indexOfCart = cartsData.findIndex((cart) => cart.userId === userId);
			if (indexOfCart !== -1) {
				resolve(cartsData[indexOfCart]);
			} else {
				resolve(await this.create(userId));
			}
		});
	};

	public delete = async (userId: string): Promise<boolean> => {
		return new Promise((resolve, reject) => {
			const indexToDelete = cartsData.findIndex((cart) => cart.userId === userId);

			if (indexToDelete !== -1) {
				cartsData[indexToDelete].isDeleted = true;
				cartsData[indexToDelete].items.length = 0;
				resolve(true);
			} else {
				reject(new Error(`Cart of User with id ${userId} not Found `));
			}
		});
	};

	public addProduct = async (dto: AddProductDto): Promise<Cart> => {
		return new Promise(async (resolve, reject) => {
			let userCartIndex = cartsData.findIndex((item) => item.userId === dto.userId);

			if (userCartIndex === -1) {
				const userCart = this.buildCart(dto.userId);
				cartsData.push(userCart);
				userCartIndex = cartsData.length - 1;
			}

			const indexOfProduct = cartsData[userCartIndex].items.findIndex(
				(item) => item.product.id === dto.product.id,
			);
			cartsData[userCartIndex].isDeleted = false;

			if (indexOfProduct === -1) {
				cartsData[userCartIndex].items.push({ product: dto.product, count: dto.count });
			} else {
				cartsData[userCartIndex].items[indexOfProduct].count = dto.count;
			}
			const cart = cartsData[userCartIndex];
			resolve(cart);
		});
	};

	public deleteProduct = async (dto: UpdateCartDto): Promise<Cart> => {
		return new Promise((resolve, reject) => {
			let userCartIndex = cartsData.findIndex((item) => item.userId === dto.userId);

			if (userCartIndex === -1) {
				const userCart = this.buildCart(dto.userId);
				cartsData.push(userCart);
				userCartIndex = cartsData.length - 1;
			}

			const indexOfProduct = cartsData[userCartIndex].items.findIndex(
				(item) => item.product.id === dto.productId,
			);

			if (indexOfProduct !== -1) {
				cartsData[userCartIndex].items.splice(indexOfProduct, 1);
				resolve(cartsData[userCartIndex]);
			} else {
				reject(new Error(`Product with id ${dto.productId} doesn't exist in the Cart`));
			}
		});
	};

	private buildCart = (userId: string): Cart => {
		return {
			id: uuidv4(),
			userId,
			isDeleted: false,
			items: [],
		};
	};
}
export const cartRepositoryArray = new CartRepositoryArray();
