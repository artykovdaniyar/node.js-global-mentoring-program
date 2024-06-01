import { Schema, model } from 'mongoose';
import Product from './product.entity';
import { v4 as uuidv4 } from 'uuid';

export const productSchema = new Schema({
	_id: {
		type: Schema.Types.UUID,
		default: () => uuidv4(),
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
});

const ProductModel = model<Product>('Product', productSchema);

export default ProductModel;
