import { Product } from './product.entity';
import { ProductRepository } from './product.repository';
import { productRepositoryArray } from './product.repository.array';

export class ProductService {
	constructor(private readonly productRepository: ProductRepository) {}

	public getAll = async (): Promise<Product[]> => {
		return await this.productRepository.readAll();
	};

	public getOne = async (id: string): Promise<Product> => {
		return await this.productRepository.readOne(id);
	};
}

export const productService = new ProductService(productRepositoryArray);
