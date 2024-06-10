import { OrderCreateDto } from '../../shared/dto/order.create.dto';
import Order from '../order.entity';

export interface OrderRepository {
	create: (dto: OrderCreateDto) => Promise<Order>;
	readAll: () => Promise<Order[]>;
	readOne: (userId: string) => Promise<Order>;
	delete: (userId: string) => Promise<boolean>;
}
