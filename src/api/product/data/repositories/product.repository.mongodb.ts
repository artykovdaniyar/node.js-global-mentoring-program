import { AddProductPropDto, UpdateProductDto } from '../../shared/dto';
import { ProductMapper, productMapper } from '../product.mapper';
import Product from '../product.entity';
import ProductModel from '../product.model';
import { ProductRepository } from './product.repository';
import { IProductRepository } from '../../shared/product.types';
import { HttpStatusCode } from '../../../../shared';
import { HTTPError } from '../../../../shared/entities/http-error.entity';
import { ICartItemRepository } from '../../../cart/shared/cart.types';

export class ProductRepositoryMongoDB implements ProductRepository {
	constructor(private productMapper: ProductMapper) {}

	public async create(dto: AddProductPropDto): Promise<Product> {
		const newProduct = await ProductModel.create({
			title: dto.title,
			description: dto.description,
			price: dto.price,
		});

		if (!newProduct) {
			throw new HTTPError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Field to create product');
		}

		return this.productMapper.toDomain(newProduct);
	}

	public readAll = async (): Promise<Product[]> => {
		const result: IProductRepository[] = await ProductModel.find().lean();

		if (!result) {
			throw new HTTPError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'No products found');
		}

		return this.productMapper.toArrayOfDomain(result);
	};

	public async readOne(id: string): Promise<Product> {
		const result: IProductRepository | null = await ProductModel.findOne({ _id: id });
		if (!result) {
			throw new HTTPError(HttpStatusCode.NOT_FOUND, `No product with such id`);
		}

		return this.productMapper.toDomain(result);
	}

	public async update(dto: UpdateProductDto): Promise<Product> {
		let result: IProductRepository | null;

		result = await ProductModel.findOneAndUpdate({ _id: dto.id }, dto);

		if (!result) {
			throw new HTTPError(HttpStatusCode.NOT_FOUND, `No product with such id`);
		}

		return this.productMapper.toDomain(result);
	}

	public delete = async (id: string): Promise<boolean> => {
		const result = await ProductModel.deleteOne({ _id: id });
		if (result.deletedCount === 0) {
			throw new HTTPError(HttpStatusCode.NOT_FOUND, `No product with such id`);
		}

		return result.acknowledged && result.deletedCount === 1;
	};

	public populateProducts = async (
		items: ICartItemRepository[],
	): Promise<ICartItemRepository[]> => {
		const cartItems: Promise<ICartItemRepository>[] = items.map(async (item) => {
			const productId = typeof item.product === 'string' ? item.product : item.product._id;
			const product = await this.readOne(productId);

			return {
				product: {
					_id: product.id,
					title: product.title,
					description: product.description,
					price: product.price,
				},
				count: item.count,
			};
		});

		const resolvedCartItems = await Promise.all(cartItems);
		return resolvedCartItems;
	};
}

export const productRepositoryMongoDB = new ProductRepositoryMongoDB(productMapper);
