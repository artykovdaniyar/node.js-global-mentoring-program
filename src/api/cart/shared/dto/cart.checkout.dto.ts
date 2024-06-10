import { OrderDeliveryDto } from '../../../order/shared/dto/order.delivery.dto';
import { OrderPaymentDto } from '../../../order/shared/dto';

export class CartCheckoutDto {
	constructor(
		readonly userId: string,
		readonly payment: OrderPaymentDto,
		readonly delivery: OrderDeliveryDto,
		readonly comments: string,
	) {}
}
