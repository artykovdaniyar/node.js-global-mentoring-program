import { Cart } from './cart.entity';
import { AddProductDto } from './dto/cart.addProduct.dto';
import { UpdateCartDto } from './dto/cart.update.dto';

export interface CartRepository {
	create: (userId: string) => Promise<Cart>;
	readAll: () => Promise<Cart[]>;
	readOne: (userId: string) => Promise<Cart>;
	delete: (id: string) => Promise<boolean>;
	addProduct: (dto: AddProductDto) => Promise<Cart>;
	deleteProduct: (dto: UpdateCartDto) => Promise<Cart>;
}
