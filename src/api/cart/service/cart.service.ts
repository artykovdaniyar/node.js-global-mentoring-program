import { CartRepository } from '../data/repositories/cart.repository';
import { UpdateCartDto } from '../shared/dto/cart.update.dto';
import { ReturnCartDto } from '../shared/dto/cart.return.dto';
import { orderService } from '../../order/service/order.service';
import { CartCheckoutDto } from '../shared/dto/cart.checkout.dto';
import { cartRepositoryMongoDB } from '../data/repositories/cart.repository.mongodb';
import { ICartService } from './cart.service.interface';
import { IOrderService } from '../../order/service/order.service.interface';

export class CartService implements ICartService {
	constructor(
		private orderService: IOrderService,
		private readonly cartRepository: CartRepository,
	) {}

	public getById = async (userId: string): Promise<ReturnCartDto> => {
		return await this.cartRepository.readOne(userId);
	};

	public update = async (dto: UpdateCartDto): Promise<ReturnCartDto> => {
		return await this.cartRepository.update(dto);
	};

	public empty = async (userId: string): Promise<boolean> => {
		return await this.cartRepository.empty(userId);
	};

	public checkout = async (dto: CartCheckoutDto) => {
		const { payment, delivery, comments, userId } = dto;
		const { id, items, total } = await this.cartRepository.checkout(dto.userId);

		return await this.orderService.create({
			userId,
			cartId: id,
			items: [...items],
			payment,
			delivery,
			comments,
			total,
		});
	};
}

export const cartService = new CartService(orderService, cartRepositoryMongoDB);
