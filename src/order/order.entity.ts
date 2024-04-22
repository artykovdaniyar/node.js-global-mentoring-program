import { CartItemEntity } from '../cart/cart.entity';
import { OrderDeliveryDto, OrderPaymentDto } from './dto';

type ORDER_STATUS = 'created' | 'completed';

export class Order {
	constructor(
		readonly id: string,
		readonly userId: string,
		readonly cartId: string,
		readonly items: CartItemEntity[],
		readonly payment: OrderPaymentDto,
		readonly delivery: OrderDeliveryDto,
		readonly comments: string,
		readonly status: ORDER_STATUS,
		readonly total: number,
	) {}
}
