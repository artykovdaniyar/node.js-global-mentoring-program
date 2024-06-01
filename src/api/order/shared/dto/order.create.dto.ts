import { OrderPaymentDto } from './order.payment.dto';
import { OrderDeliveryDto } from './order.delivery.dto';
import { ICartItemRepository } from '../../../cart/shared/cart.types';

export class OrderCreateDto {
	constructor(
		public readonly userId: string,
		public readonly cartId: string,
		public readonly items: ICartItemRepository[],
		public readonly payment: OrderPaymentDto,
		public readonly delivery: OrderDeliveryDto,
		public readonly comments: string,
		public readonly total: number,
	) {}
}
