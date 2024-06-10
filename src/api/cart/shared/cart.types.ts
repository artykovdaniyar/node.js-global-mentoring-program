import { IProductRepository } from '../../product/shared/product.types';
import { Cart } from '../data/cart.entity';

export interface ICartItemRepository {
	product: string | IProductRepository;
	count: number;
}

export interface ICartRepository extends Pick<Cart, 'isDeleted' | 'userId'> {
	items: ICartItemRepository[];
	_id?: string;
}
