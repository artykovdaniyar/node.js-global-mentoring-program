import { OrderCreateDto } from './dto/order.create.dto';
import { Order } from './order.entity';

export interface OrderRepository {
	create: (dto: OrderCreateDto) => Promise<Order>;
	readOne: (id: string) => Promise<Order>;
	readAll: () => Promise<Order[]>;
}
