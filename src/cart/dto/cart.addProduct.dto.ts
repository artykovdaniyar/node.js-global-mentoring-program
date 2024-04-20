import { Product } from '../../product/product.entity';

export class AddProductDto {
	constructor(
		readonly userId: string,
		readonly product: Product,
		readonly count: number,
	) {}
}
