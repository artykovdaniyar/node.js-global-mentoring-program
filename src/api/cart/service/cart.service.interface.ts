import { CartCheckoutDto } from '../shared/dto/cart.checkout.dto';
import { ReturnCartDto } from '../shared/dto/cart.return.dto';
import { UpdateCartDto } from '../shared/dto/cart.update.dto';

export interface ICartService {
	getById(userId: string): Promise<ReturnCartDto>;
	update(dto: UpdateCartDto): Promise<ReturnCartDto>;
	empty(userId: string): Promise<boolean>;
	checkout(dto: CartCheckoutDto): Promise<any>;
}
