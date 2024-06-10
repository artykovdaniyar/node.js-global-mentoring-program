import Product from './product.entity';
import { IProductRepository } from '../shared/product.types';

export class ProductMapper {
	constructor() {}

	public toArrayOfDomain(data: IProductRepository[]): Product[] {
		return data.map(({ _id, title, description, price }) => ({
			id: _id,
			title,
			description,
			price,
		}));
	}

	public toDomain<T>(product: T): Product {
		const { _id, title, description, price } = product as IProductRepository;
		return { id: _id, title, description, price };
	}
}

export const productMapper = new ProductMapper();
