import Order from '../data/order.entity';
import { OrderCreateDto } from '../shared/dto';

export interface IOrderService {
	create(dto: OrderCreateDto): Promise<Order>;
	getOne(id: string): Promise<Order>;
	getAll(userId: string): Promise<Order[]>;
}
