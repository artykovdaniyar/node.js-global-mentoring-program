import { OrderDeliveryDto } from 'order/dto/order.delivery.dto';
import { OrderPaymentDto } from 'order/dto/order.payment.dto';

export class CartCheckoutDto {
	constructor(
		readonly userId: string,
		readonly payment: OrderPaymentDto,
		readonly delivery: OrderDeliveryDto,
		readonly comments: string,
	) {}
}
