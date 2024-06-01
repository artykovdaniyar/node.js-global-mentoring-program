import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ICartRepository } from '../shared/cart.types';

export const cartItemSchema: Schema = new Schema({
	product: { type: Schema.Types.UUID, ref: 'Product', required: true },
	count: { type: Number, required: true, default: 1 },
});

const cartSchema = new Schema({
	_id: { type: Schema.Types.UUID, default: () => uuidv4() },
	userId: {
		type: Schema.Types.UUID,
		ref: 'User',
		default: uuidv4(),
	},
	isDeleted: {
		type: Boolean,
		default: false,
	},
	items: [cartItemSchema],
});

const CartModel = model<ICartRepository>('Cart', cartSchema);

export default CartModel;
