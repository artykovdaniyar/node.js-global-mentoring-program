import { CartItemEntity } from 'cart/cart.entity';
import { OrderPaymentDto } from './order.payment.dto';
import { OrderDeliveryDto } from './order.delivery.dto';

export class OrderCreateDto {
	constructor(
		readonly userId: string,
		readonly cartId: string,
		readonly items: CartItemEntity[],
		readonly payment: OrderPaymentDto,
		readonly delivery: OrderDeliveryDto,
		readonly comments: string,
	) {}
}
