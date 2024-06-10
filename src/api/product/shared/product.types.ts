import Product from '../data/product.entity';

export interface IProductRepository extends Omit<Product, 'id'> {
	_id: string;
}
