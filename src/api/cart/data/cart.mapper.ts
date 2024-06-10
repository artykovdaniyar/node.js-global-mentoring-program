import { ProductMapper, productMapper } from '../../product/data/product.mapper';
import { ICartItemEntity } from './cart.entity';
import { CartReturnCheckoutDto } from '../shared/dto/cart.return.checkout.dto';
import { ReturnCartDto } from '../shared/dto/cart.return.dto';
import { ICartItemRepository, ICartRepository } from '../shared/cart.types';

export class CartMapper {
	constructor(private productMapper: ProductMapper) {}

	public toReturnOfArrayDto = (data: ICartRepository[]): ReturnCartDto[] => {
		return data.map((cart) => {
			return this.toReturnDto(cart);
		});
	};

	public toReturnDto(cart: ICartRepository): ReturnCartDto {
		const cartItems = this.toCartItemEntity(cart.items);
		const cartId = cart._id;

		return { cart: { id: cartId, items: cartItems }, total: this.countTotalPrice(cartItems) };
	}

	public toCartReturnCheckoutDto(data): CartReturnCheckoutDto {
		const {
			cart: { id, items },
			total,
		} = data as ReturnCartDto;
		return { id, items: this.toCartItemRepository(items), total };
	}

	public toCartItemRepository(
		cartItems: ICartItemEntity[] | ICartItemRepository[],
	): ICartItemRepository[] {
		return cartItems.map((item) => {
			return {
				product: item.product.id,
				count: item.count,
			};
		});
	}

	public toCartItemEntity(cartItems: ICartItemRepository[]): ICartItemEntity[] {
		return cartItems.map((item) => {
			if (typeof item.product !== 'string')
				return {
					product: this.productMapper.toDomain(item.product),
					count: item.count,
				};
		});
	}

	private countTotalPrice = (items: ICartItemEntity[]) => {
		if (!items.length) {
			return 0;
		}

		return items.reduce((acc, item) => {
			return acc + item.product.price * item.count;
		}, 0);
	};
}
export const cartMapper = new CartMapper(productMapper);
