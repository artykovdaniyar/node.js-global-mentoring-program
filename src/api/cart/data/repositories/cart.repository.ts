import { CartReturnCheckoutDto } from '../../shared/dto/cart.return.checkout.dto';
import { ReturnCartDto } from '../../shared/dto/cart.return.dto';
import { UpdateCartDto } from '../../shared/dto/cart.update.dto';

export interface CartRepository {
	create: (userId: string) => Promise<ReturnCartDto>;
	readAll: () => Promise<ReturnCartDto[]>;
	readOne: (userId: string) => Promise<ReturnCartDto>;
	update: (dto: UpdateCartDto) => Promise<ReturnCartDto>;
	delete: (userId: string) => Promise<boolean>;
	empty: (userId: string) => Promise<boolean>;
	checkout: (userId: string) => Promise<CartReturnCheckoutDto>;
}
