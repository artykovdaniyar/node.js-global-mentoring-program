import { OrderCreateDto } from './dto/order.create.dto';
import { OrderRepository } from './order.repository';
import { orderRepositoryArray } from './order.repository.array';

export class OrderService {
	constructor(private orderRepository: OrderRepository) {}

	public create = async (dto: OrderCreateDto) => {
		return await this.orderRepository.create(dto);
	};

	public getOne = async (id: string) => {
		return await this.orderRepository.readOne(id);
	};

	public getAll = async () => {
		return await this.orderRepository.readAll();
	};
}

export const orderService = new OrderService(orderRepositoryArray);
