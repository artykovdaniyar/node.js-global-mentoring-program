import { CartMapper, cartMapper } from '../../cart/data/cart.mapper';
import { IOrderRepository } from '../shared/order.types';
import { OrderReturnDto } from '../shared/dto/order.return.dto';
import Order from './order.entity';
import { ICartItemEntity } from '../../cart/data/cart.entity';
import { ICartItemRepository } from '../../cart/shared/cart.types';

export class OrderMapper {
	constructor(private cartMapper: CartMapper) {}

	public toArrayOfDomain(data: IOrderRepository[]): Order[] {
		return data.map((order) => {
			return this.toDomain(order);
		});
	}

	public toDomain<T>(order: T): Order {
		const { _id, userId, cartId, items, payment, delivery, comments, status, total } =
			order as IOrderRepository;

		return {
			id: _id,
			userId,
			cartId,
			items: this.toCartItemEntity(items),
			payment,
			delivery,
			comments,
			status,
			total,
		};
	}

	public toReturnDto<T>(order: T): OrderReturnDto {
		const { _id, userId, cartId, items, payment, delivery, comments, status, total } =
			order as IOrderRepository;

		return {
			id: _id,
			userId,
			cartId,
			items: this.toCartItemEntity(items),
			payment,
			delivery,
			comments,
			status,
			total,
		};
	}

	public toCartItemEntity(items: ICartItemRepository[]): ICartItemEntity[] {
		return this.cartMapper.toCartItemEntity(items);
	}

	public toCartItemRepository(items: ICartItemEntity[]): ICartItemRepository[] {
		return this.cartMapper.toCartItemRepository(items);
	}
}

export const orderMapper = new OrderMapper(cartMapper);
