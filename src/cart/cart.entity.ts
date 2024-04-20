import { Product } from 'product/product.entity';

export interface CartItemEntity {
	product: Product;
	count: number;
}

export class Cart {
	constructor(
		readonly id: string,
		readonly userId: string,
		public items: CartItemEntity[],
		public isDeleted: boolean,
	) {}
}
