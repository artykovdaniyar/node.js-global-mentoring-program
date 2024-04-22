import { AddProductPropDto, UpdateProductDto } from './dto';
import { Product } from './product.entity';

export interface ProductRepository {
	create: (dto: AddProductPropDto) => Promise<Product>;
	readAll: () => Promise<Product[]>;
	readOne: (id: string) => Promise<Product>;
	update: (dto: UpdateProductDto) => Promise<Product>;
	delete: (id: string) => Promise<boolean>;
}
