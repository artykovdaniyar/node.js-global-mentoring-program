import { ProductService, productService } from '../product/product.service';
import { Cart, CartItemEntity } from './cart.entity';
import { CartRepository } from './cart.repository';
import { cartRepositoryArray } from './cart.repository.array';
import { UpdateCartDto } from './dto/cart.update.dto';
import { AddProductDto } from './dto/cart.addProduct.dto';
import { ReturnCartDto } from './dto/cart.return.dto';
import { CartCheckoutDto } from './dto/cart.checkout.dto';

export class CartService {
	constructor(
		private productService: ProductService,
		private readonly cartRepository: CartRepository,
	) {}

	public getById = async (userId: string): Promise<ReturnCartDto> => {
		const cart = await this.cartRepository.readOne(userId);
		return this.transfromToReturnCartDto(cart);
	};

	public update = async (dto: UpdateCartDto): Promise<ReturnCartDto> => {
		if (dto.count === 0) {
			const cart = await this.cartRepository.deleteProduct(dto);
			return this.transfromToReturnCartDto(cart);
		} else {
			const product = await this.productService.getOne(dto.productId);
			const addProductDto: AddProductDto = {
				product,
				userId: dto.userId,
				count: dto.count,
			};

			const cart = await this.cartRepository.addProduct(addProductDto);
			return this.transfromToReturnCartDto(cart);
		}
	};

	public empty = async (userId: string): Promise<boolean> => {
		return await this.cartRepository.delete(userId);
	};

	private transfromToReturnCartDto = (cart: Cart): ReturnCartDto => {
		return { cart: { id: cart.id, items: cart.items }, total: this.countTotalPrice(cart.items) };
	};

	private countTotalPrice = (items: CartItemEntity[]) => {
		if (!items.length) {
			return 0;
		}

		return items.reduce((acc, item) => {
			return acc + item.product.price * item.count;
		}, 0);
	};
}

export const cartService = new CartService(productService, cartRepositoryArray);
