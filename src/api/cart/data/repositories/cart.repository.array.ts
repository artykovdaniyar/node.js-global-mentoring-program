import { v4 as uuidv4 } from 'uuid';
import { CartRepository } from './cart.repository';
import { CartReturnCheckoutDto, ReturnCartDto, UpdateCartDto } from '../../shared/dto';
import { ICartRepository } from '../../shared/cart.types';
import { CartMapper, cartMapper } from '../cart.mapper';
import { HTTPError } from '../../../../shared/entities/http-error.entity';
import { HttpStatusCode } from '../../../../shared';
import { ProductRepository } from '../../../product/data/repositories/product.repository';
import { productRepositoryArray } from '../../../product/data/repositories/product.repository.array';
import { cartsData } from '../cartsData';

export class CartRepositoryArray implements CartRepository {
	constructor(
		private productRepository: ProductRepository,
		private cartMapper: CartMapper,
	) {}
	empty: (userId: string) => Promise<boolean>;

	public create = async (userId: string): Promise<ReturnCartDto> => {
		return new Promise(async (resolve) => {
			let newCart: ICartRepository = this.buildCart(userId);
			cartsData.push(newCart);
			resolve(this.cartMapper.toReturnDto(newCart));
		});
	};

	public readAll = async (): Promise<ReturnCartDto[]> => {
		return new Promise(async (resolve, reject) => {
			if (Array.isArray(cartsData)) {
				const productPopulatedCarts = await Promise.all(
					cartsData.map(async (item) => ({
						...item,
						items: await this.productRepository.populateProducts(item.items),
					})),
				);
				const carts = this.cartMapper.toReturnOfArrayDto(productPopulatedCarts);
				resolve(carts);
			} else {
				reject(new HTTPError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'No carts found'));
			}
		});
	};

	public readOne = async (userId: string): Promise<ReturnCartDto> => {
		return new Promise(async (resolve) => {
			const indexOfCart = cartsData.findIndex((cart) => cart.userId === userId);
			if (indexOfCart !== -1) {
				const cart = cartsData[indexOfCart];
				cart.items = await this.productRepository.populateProducts(cart.items);
				resolve(this.cartMapper.toReturnDto(cart));
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
				reject(
					new HTTPError(HttpStatusCode.NOT_FOUND, `Cart of User with id ${userId} not Found `),
				);
			}
		});
	};

	public checkout = async (userId: string): Promise<CartReturnCheckoutDto> => {
		return new Promise(async (resolve, reject) => {
			let userCartIndex = cartsData.findIndex((item) => item.userId === userId);
			let cart = { ...cartsData[userCartIndex] };

			if (!cart.isDeleted && cart.items.length) {
				cartsData[userCartIndex].isDeleted = true;
				cart.items = await this.productRepository.populateProducts(cart.items);
				cartsData[userCartIndex].items = [];

				resolve(this.cartMapper.toCartReturnCheckoutDto(this.cartMapper.toReturnDto(cart)));
			} else {
				reject(
					new HTTPError(
						HttpStatusCode.NOT_FOUND,
						`Cart is empty, Please consider to add products to your cart`,
					),
				);
			}
		});
	};

	public update = async (dto: UpdateCartDto): Promise<ReturnCartDto> => {
		return new Promise(async (resolve) => {
			let result: ICartRepository;
			const { userId, count } = dto;
			let userCartIndex = cartsData.findIndex((item) => item.userId === userId);

			if (!cartsData[userCartIndex]) {
				const userCart = this.buildCart(dto.userId);
				cartsData.push(userCart);
				userCartIndex = cartsData.length - 1;
			}

			if (count > 0) {
				// Update or Add Product
				result = this.addOrUpdateCartItem(dto, userCartIndex);
			} else if (count <= 0) {
				// Delete	Product
				result = this.deleteCartItem(dto, userCartIndex);
			}

			result = { ...result, items: await this.productRepository.populateProducts(result.items) };

			return resolve(this.cartMapper.toReturnDto(result));
		});
	};

	private addOrUpdateCartItem = (dto: UpdateCartDto, userCartIndex: number): ICartRepository => {
		const indexOfItem = cartsData[userCartIndex].items.findIndex(
			(item) => item.product === dto.productId,
		);

		if (indexOfItem === -1) {
			// Add Pruduct
			return this.addCartItem(dto, userCartIndex);
		}
		// Update Pruduct
		return this.updateCartItem(dto, userCartIndex, indexOfItem);
	};

	private addCartItem = (dto: UpdateCartDto, userCartIndex: number): ICartRepository => {
		const product = {
			product: dto.productId,
			count: dto.count,
		};

		cartsData[userCartIndex].items.push(product);
		return cartsData[userCartIndex];
	};

	private updateCartItem = (
		dto: UpdateCartDto,
		userCartIndex: number,
		indexOfItem: number,
	): ICartRepository => {
		cartsData[userCartIndex].items[indexOfItem] = {
			product: dto.productId,
			count: dto.count,
		};

		const result = cartsData[userCartIndex];

		return result;
	};

	private deleteCartItem = (dto: UpdateCartDto, userCartIndex: number): ICartRepository => {
		cartsData[userCartIndex].items = cartsData[userCartIndex].items.filter(
			(item) => item.product !== dto.productId,
		);

		return cartsData[userCartIndex];
	};

	private buildCart = (userId: string): ICartRepository => {
		return {
			_id: uuidv4(),
			userId,
			isDeleted: false,
			items: [],
		};
	};
}
export const cartRepositoryArray = new CartRepositoryArray(productRepositoryArray, cartMapper);
