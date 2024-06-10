import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Order from './order.entity';
import { cartItemSchema } from '../../cart/data/cart.model';

const orderSchema = new Schema({
	_id: {
		type: Schema.Types.UUID,
		default: () => uuidv4(),
	},

	userId: {
		type: Schema.Types.UUID,
		ref: 'User',
		default: uuidv4(),
	},

	cartId: {
		type: Schema.Types.UUID,
		ref: 'User',
		default: uuidv4(),
	},
	items: [cartItemSchema],

	payment: {
		type: {
			type: String,
			required: true,
		},
		address: String,
		creditCard: String,
	},
	delivery: {
		type: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
	},
	comments: String,
	status: {
		type: String,
		enum: ['created', 'completed'],
		default: 'created',
	},
	total: {
		type: Number,
		required: true,
	},
});
const OrderModel = model<Order>('Order', orderSchema);

export default OrderModel;
