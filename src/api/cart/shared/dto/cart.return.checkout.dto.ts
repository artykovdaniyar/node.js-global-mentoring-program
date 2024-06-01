import { ICartItemRepository } from '../cart.types';

export class CartReturnCheckoutDto {
	constructor(
		readonly id: string,
		readonly items: ICartItemRepository[],
		readonly total: number,
	) {}
}
