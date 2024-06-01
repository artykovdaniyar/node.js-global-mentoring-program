import Product from '../data/product.entity';
import { ProductRepository } from '../data/repositories/product.repository';
import { productRepositoryMongoDB } from '../data/repositories/product.repository.mongodb';
import { AddProductPropDto } from '../shared/dto';

export class ProductService {
	constructor(private readonly productRepository: ProductRepository) {}

	public getAll = async (): Promise<Product[]> => {
		return await this.productRepository.readAll();
	};

	public getOne = async (id: string): Promise<Product> => {
		return await this.productRepository.readOne(id);
	};

	public add = async (dto: AddProductPropDto): Promise<Product> => {
		return await this.productRepository.create(dto);
	};
}

export const productService = new ProductService(productRepositoryMongoDB);
