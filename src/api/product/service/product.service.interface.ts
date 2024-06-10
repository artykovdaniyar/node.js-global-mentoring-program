import { AddProductPropDto } from '../shared/dto';
import Product from '../data/product.entity';

export interface IProductService {
	getAll(): Promise<Product[]>;
	getOne(id: string): Promise<Product>;
	add(dto: AddProductPropDto): Promise<Product>;
}
