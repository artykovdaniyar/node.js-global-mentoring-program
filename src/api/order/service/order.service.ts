import { IOrderService } from './order.service.interface';
import Order from '../data/order.entity';
import { OrderCreateDto } from '../shared/dto/order.create.dto';
import { OrderRepository } from '../data/repositories/order.repository';
import { orderRepositoryMongoDB } from '../data/repositories/order.repository.mongodb';

export class OrderService implements IOrderService {
	constructor(private orderRepository: OrderRepository) {}

	public create = async (dto: OrderCreateDto): Promise<Order> => {
		return await this.orderRepository.create(dto);
	};

	public getOne = async (id: string): Promise<Order> => {
		return await this.orderRepository.readOne(id);
	};

	public getAll = async (): Promise<Order[]> => {
		return await this.orderRepository.readAll();
	};
}

export const orderService = new OrderService(orderRepositoryMongoDB);
