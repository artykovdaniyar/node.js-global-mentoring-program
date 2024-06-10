import { v4 as uuidv4 } from 'uuid';
import { CartMapper, cartMapper } from '../cart.mapper';
import CartModel from '../cart.model';
import { CartRepository } from './cart.repository';
import { ReturnCartDto, UpdateCartDto, CartReturnCheckoutDto } from '../../shared/dto';
import { ICartRepository } from '../../shared/cart.types';
import { HTTPError } from '../../../../shared/entities/http-error.entity';
import { HttpStatusCode } from '../../../../shared';

class CartRepositoryMongoDB implements CartRepository {
	constructor(private cartMapper: CartMapper) {}

	public create = async (userId: string): Promise<ReturnCartDto> => {
		const emptyCart = this.buildEmptyCart(userId);
		const newProduct: unknown = await CartModel.create({ ...emptyCart });

		return this.cartMapper.toReturnDto(newProduct as ICartRepository);
	};

	public readAll = async (): Promise<ReturnCartDto[]> => {
		const result: ICartRepository[] = await CartModel.find().lean();
		if (!result) {
			throw new HTTPError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'No products found');
		}

		return this.cartMapper.toReturnOfArrayDto(result);
	};

	public readOne = async (userId: string): Promise<ReturnCartDto> => {
		const result: ICartRepository = await CartModel.findOne({ userId })
			.lean()
			.populate({ path: 'items.product', strictPopulate: false })
			.exec();

		if (!result) {
			return await this.create(userId);
		}

		return this.cartMapper.toReturnDto(result);
	};

	public update = async (dto: UpdateCartDto): Promise<ReturnCartDto> => {
		let result: ICartRepository;

		const { userId, productId, count } = dto;
		const cart = await CartModel.findOne({ userId, 'items.product': productId });
		if (cart && count > 0) {
			// Update Product
			result = await this.updateCartItem(dto);
		} else if (cart && count <= 0) {
			// Delete	Product
			result = await this.deleteCartItem(dto);
		} else {
			// Add Product
			result = await this.addCartItem(dto);
		}
		return this.cartMapper.toReturnDto(result);
	};

	public delete = async (userId: string): Promise<boolean> => {
		const result = await CartModel.deleteOne({ userId });
		if (result.deletedCount === 0) {
			throw new HTTPError(HttpStatusCode.NOT_FOUND, `Card of user with id ${userId} doesn't exist`);
		}

		return result.acknowledged && result.deletedCount === 1;
	};

	public empty = async (userId: string): Promise<boolean> => {
		await CartModel.findOneAndUpdate({ userId }, { $set: { items: [] } }, { new: true });

		return true;
	};

	public checkout = async (userId: string): Promise<CartReturnCheckoutDto> => {
		const result = await this.readOne(userId);

		if (result.cart.items.length) {
			await CartModel.updateOne({ userId }, { $set: { isDeleted: true, items: [] } });
			return this.cartMapper.toCartReturnCheckoutDto(result);
		} else {
			throw new HTTPError(
				HttpStatusCode.NOT_FOUND,
				`Cart is empty, Please consider to add products to your cart`,
			);
		}
	};

	private updateCartItem = async (dto: UpdateCartDto) => {
		return await CartModel.findOneAndUpdate(
			{ userId: dto.userId, 'items.product': dto.productId },
			{ $set: { 'items.$.count': dto.count } },
			{ new: true },
		).populate('items.product');
	};

	private addCartItem = async (dto: UpdateCartDto) => {
		return await CartModel.findOneAndUpdate(
			{ userId: dto.userId },
			{ $push: { items: { product: dto.productId, count: dto.count } } },
			{ new: true, upsert: true, setDefaultsOnInsert: true },
		).populate('items.product');
	};

	private deleteCartItem = async (dto: UpdateCartDto): Promise<ICartRepository> => {
		return await CartModel.findOneAndUpdate(
			{ userId: dto.userId },
			{ $pull: { items: { product: dto.productId } } },
			{ new: true, upsert: true, setDefaultsOnInsert: true },
		).populate('items.product');
	};

	private buildEmptyCart = (userId: string): ICartRepository => {
		return {
			_id: uuidv4(),
			userId,
			isDeleted: false,
			items: [],
		};
	};
}

export const cartRepositoryMongoDB = new CartRepositoryMongoDB(cartMapper);
