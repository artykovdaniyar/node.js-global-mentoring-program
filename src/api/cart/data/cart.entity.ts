import Product from '../../product/data/product.entity';

export interface ICartItemEntity {
	product: Product;
	count: number;
}

export class Cart {
	constructor(
		readonly id: string,
		readonly userId: string,
		public items: ICartItemEntity[],
		public isDeleted: boolean,
	) {}
}
