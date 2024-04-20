import { v4 as uuidv4 } from 'uuid';
import { OrderCreateDto } from './dto';
import { Order } from './order.entity';
import { OrderRepository } from './order.repository';
import { ordersData } from './ordersData';
import { CartItemEntity } from '../cart/cart.entity';

export class OrderRepositoryArray implements OrderRepository {
	public create = async (dto: OrderCreateDto): Promise<Order> => {
		return new Promise((resolve, reject) => {
			const newOrder = this.buildOrder(dto);
			ordersData.push(newOrder);
			resolve(newOrder);
		});
	};

	public readAll = async (): Promise<Order[]> => {
		return new Promise((resolve, reject) => {
			resolve(ordersData);
		});
	};

	public readOne = async (id: string): Promise<Order> => {
		return new Promise((resolve, reject) => {
			const index = ordersData.findIndex((order) => {
				order.id === id;
			});

			if (index !== -1) {
				resolve(ordersData[index]);
			} else {
				reject(new Error(`Not found order with id ${id}`));
			}
		});
	};

	private buildOrder = (dto: OrderCreateDto): Order => {
		return { id: uuidv4(), ...dto, status: 'created', total: this.countTotalPrice(dto.items) };
	};

	private countTotalPrice = (items: CartItemEntity[]) => {
		if (!items.length) {
			return 0;
		}

		return items.reduce((acc, item) => {
			return acc + item.product.price * item.count;
		}, 0);
	};
}

export const orderRepositoryArray = new OrderRepositoryArray();
