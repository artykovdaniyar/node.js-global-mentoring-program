import { OrderDeliveryDto, OrderPaymentDto } from '../dto';

import { ICartItemEntity } from '../../../cart/data/cart.entity';

export type ORDER_STATUS = 'created' | 'completed';

export class OrderReturnDto {
	constructor(
		readonly id: string,
		readonly userId: string,
		readonly cartId: string,
		readonly items: ICartItemEntity[],
		readonly payment: OrderPaymentDto,
		readonly delivery: OrderDeliveryDto,
		readonly comments: string,
		readonly status: ORDER_STATUS,
		readonly total: number,
	) {}
}
