import { ICartItemEntity } from '../../data/cart.entity';

interface ReturnCart {
	id: string;
	items: ICartItemEntity[];
}

export class ReturnCartDto {
	constructor(
		readonly cart: ReturnCart,
		readonly total: number,
	) {}
}
