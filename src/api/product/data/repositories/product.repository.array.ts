import { v4 as uuidv4 } from 'uuid';
import { AddProductPropDto, UpdateProductDto } from '../../shared/dto';
import { ProductRepository } from './product.repository';
import { productsData } from '../productsData';
import { IProductRepository } from '../../shared/product.types';
import { ProductMapper, productMapper } from '../product.mapper';
import { ReturnProductDto } from '../../shared/dto/product.return.dto';
import { HttpStatusCode } from '../../../../shared';
import { HTTPError } from '../../../../shared/entities/http-error.entity';
import { ICartItemRepository } from '../../../cart/shared/cart.types';

export class ProductRepositoryArray implements ProductRepository {
	constructor(private productMapper: ProductMapper) {}

	public create = async (dto: AddProductPropDto): Promise<ReturnProductDto> => {
		return new Promise((resolve, reject) => {
			try {
				const newProduct: IProductRepository = { ...dto, _id: uuidv4() };
				productsData.push(newProduct);
				resolve(this.productMapper.toDomain(newProduct));
			} catch (error: any) {
				reject(new HTTPError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Field to create product'));
			}
		});
	};

	public readAll = async (): Promise<ReturnProductDto[]> => {
		return new Promise((resolve, reject) => {
			if (Array.isArray(productsData)) {
				resolve(this.productMapper.toArrayOfDomain(productsData));
			} else {
				reject(new HTTPError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'No products found'));
			}
		});
	};

	public readOne = async (id: string): Promise<ReturnProductDto> => {
		return new Promise((resolve, reject) => {
			const indexOfProduct = productsData.findIndex((user) => user._id === id);
			if (indexOfProduct !== -1) {
				resolve(this.productMapper.toDomain(productsData[indexOfProduct]));
			} else {
				reject(new HTTPError(HttpStatusCode.NOT_FOUND, `Product with id ${id} doesn't exist`));
			}
		});
	};

	public update = async (dto: UpdateProductDto): Promise<ReturnProductDto> => {
		return new Promise((resolve, reject) => {
			const indexToUpdate = productsData.findIndex((user) => user._id === dto.id);

			if (indexToUpdate !== -1) {
				const updatedUser = { ...productsData[indexToUpdate], ...dto };
				productsData[indexToUpdate] = updatedUser;

				resolve(this.productMapper.toDomain(updatedUser));
			} else {
				reject(
					new HTTPError(HttpStatusCode.NOT_FOUND, `Product with ID ${dto.id} does not exist.`),
				);
			}
		});
	};

	public delete = async (id: string): Promise<boolean> => {
		return new Promise((resolve, reject) => {
			const indexToDelete = productsData.findIndex((user) => user._id === id);
			if (indexToDelete !== -1) {
				productsData.splice(indexToDelete, 1);
				resolve(true);
			} else {
				reject(new HTTPError(HttpStatusCode.NOT_FOUND, `Product with ID ${id} does not exist.`));
			}
		});
	};

	populateProducts = async (items: ICartItemRepository[]): Promise<ICartItemRepository[]> => {
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
export const productRepositoryArray = new ProductRepositoryArray(productMapper);
