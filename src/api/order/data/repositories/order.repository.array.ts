import { v4 as uuidv4 } from 'uuid';
import { OrderCreateDto } from '../../shared/dto';
import { OrderRepository } from './order.repository';
import { OrderMapper, orderMapper } from '../order.mapper';
import Order from '../order.entity';
import { ordersData } from '../ordersData';
import { ICartItemEntity } from '../../../cart/data/cart.entity';
import { IOrderRepository } from '../../shared/order.types';
import { HTTPError } from '../../../../shared/entities/http-error.entity';
import { HttpStatusCode } from '../../../../shared';
import { ICartItemRepository } from '../../../cart/shared/cart.types';
import { ProductRepository } from '../../../product/data/repositories/product.repository';
import { productRepositoryArray } from '../../../product/data/repositories/product.repository.array';

export class OrderRepositoryArray implements OrderRepository {
	constructor(
		private productRepository: ProductRepository,
		private orderMapper: OrderMapper,
	) {}

	public create = async (dto: OrderCreateDto): Promise<Order> => {
		return new Promise(async (resolve) => {
			const newOrder = this.buildOrder(dto);
			ordersData.push(newOrder);
			newOrder.items = await this.productRepository.populateProducts(newOrder.items);
			resolve(this.orderMapper.toDomain(newOrder));
		});
	};

	public readAll = async (): Promise<Order[]> => {
		return new Promise((resolve, reject) => {
			if (Array.isArray(ordersData)) {
				resolve(this.orderMapper.toArrayOfDomain(ordersData));
			} else {
				reject(new HTTPError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'No orders found'));
			}
		});
	};

	public readOne = async (id: string): Promise<Order> => {
		return new Promise((resolve, reject) => {
			const index = ordersData.findIndex((order) => {
				order._id === id;
			});

			if (index !== -1) {
				resolve(this.orderMapper.toDomain(ordersData[index]));
			} else {
				reject(new HTTPError(HttpStatusCode.NOT_FOUND, `The order not found`));
			}
		});
	};

	public delete = async (userId: string): Promise<boolean> => {
		return new Promise((resolve, reject) => {
			const indexToDelete = ordersData.findIndex((order) => order._id === userId);
			if (indexToDelete !== -1) {
				ordersData.splice(indexToDelete, 1);
				resolve(true);
			} else {
				reject(new HTTPError(HttpStatusCode.NOT_FOUND, `the order not found`));
			}
		});
	};

	private buildOrder = (dto: OrderCreateDto): IOrderRepository => {
		const { userId, cartId, items, payment, delivery, comments } = dto;

		return {
			_id: uuidv4(),
			userId,
			cartId,
			items,
			payment,
			delivery,
			comments,
			status: 'created',
			total: this.countTotalPrice(dto.items),
		};
	};

	private countTotalPrice = (items: ICartItemEntity[] | ICartItemRepository[]) => {
		if (!items.length) {
			return 0;
		}

		return items.reduce((acc, item) => {
			if (typeof item.product !== 'string') {
				return acc + item.product.price * item.count;
			}
		}, 0);
	};
}

export const orderRepositoryArray = new OrderRepositoryArray(productRepositoryArray, orderMapper);
