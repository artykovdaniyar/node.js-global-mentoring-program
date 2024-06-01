import { ICartItemRepository } from '../../cart/shared/cart.types';
import Order from '../data/order.entity';

export interface IOrderRepository extends Omit<Order, 'id' | 'items'> {
	_id: string;
	items: ICartItemRepository[];
}
