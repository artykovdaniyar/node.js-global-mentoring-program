import { Model } from 'mongoose';
import { OrderRepository } from './order.repository';
import { OrderCreateDto } from '../../shared/dto';
import { IOrderRepository } from '../../shared/order.types';
import { OrderMapper, orderMapper } from '../order.mapper';
import Order from '../order.entity';
import OrderModel from '../order.model';
import { HttpStatusCode } from '../../../../shared';
import { HTTPError } from '../../../../shared/entities/http-error.entity';

export class OrderRepositoryMongoDB implements OrderRepository {
	constructor(
		private model: Model<Order>,
		private orderMapper: OrderMapper,
	) {}

	public create = async (dto: OrderCreateDto): Promise<Order> => {
		const newOrder: IOrderRepository | null = await (
			await this.model.create({ ...dto })
		).populate({ path: 'items.product', strictPopulate: false });

		if (!newOrder) {
			throw new HTTPError(
				HttpStatusCode.INTERNAL_SERVER_ERROR,
				`Failed to create order for user: ${dto.userId}`,
			);
		}

		if (newOrder.items.length === 0) {
			throw new HTTPError(
				HttpStatusCode.NOT_FOUND,
				`Cart is empty, Please consider to add products to your cart`,
			);
		}

		return this.orderMapper.toDomain(newOrder);
	};

	public readAll = async (): Promise<Order[]> => {
		const result: IOrderRepository[] = await this.model.find().lean();

		if (!result) {
			throw new HTTPError(HttpStatusCode.NOT_FOUND, `No orders found`);
		}

		return this.orderMapper.toArrayOfDomain(result);
	};

	public readOne = async (userId: string): Promise<Order> => {
		const result = await this.model
			.findOne({ userId })
			.lean()
			.populate({ path: 'items.product', strictPopulate: false });

		if (!result) {
			throw new HTTPError(HttpStatusCode.NOT_FOUND, `the order not found`);
		}

		return this.orderMapper.toDomain(result);
	};

	public delete = async (userId: string): Promise<boolean> => {
		const result = await this.model.deleteOne({ userId });
		if (result.deletedCount === 0) {
			throw new HTTPError(HttpStatusCode.NOT_FOUND, `the order not found`);
		}

		return result.acknowledged && result.deletedCount === 1;
	};
}

export const orderRepositoryMongoDB = new OrderRepositoryMongoDB(OrderModel, orderMapper);
