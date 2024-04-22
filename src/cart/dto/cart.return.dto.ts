import { CartItemEntity } from '../cart.entity';

interface ReturnCart {
	id: string;
	items: CartItemEntity[];
}

export class ReturnCartDto {
	constructor(
		readonly cart: ReturnCart,
		readonly total: number,
	) {}
}
