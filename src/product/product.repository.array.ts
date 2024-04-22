import { v4 as uuidv4 } from 'uuid';
import { AddProductPropDto, UpdateProductDto } from './dto';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';
import { productsData } from './productsData';

export class ProductRepositoryArray implements ProductRepository {
	public create = async (dto: AddProductPropDto): Promise<Product> => {
		return new Promise((resolve, reject) => {
			const newProduct: Product = { ...dto, id: uuidv4() };
			productsData.push(newProduct);
			resolve(newProduct);
		});
	};

	public readAll = async (): Promise<Product[]> => {
		return new Promise((resolve, reject) => {
			if (Array.isArray(productsData)) {
				resolve(productsData);
			} else {
				reject(new Error('Products not Found'));
			}
		});
	};

	public readOne = async (id: string): Promise<Product> => {
		return new Promise((resolve, reject) => {
			const indexOfProduct = productsData.findIndex((user) => user.id === id);
			if (indexOfProduct !== -1) {
				resolve(productsData[indexOfProduct]);
			} else {
				reject(new Error(`Product with id ${id} doesn't exist`));
			}
		});
	};

	public update = async (dto: UpdateProductDto): Promise<Product> => {
		return new Promise((resolve, reject) => {
			const indexToUpdate = productsData.findIndex((user) => user.id === dto.id);

			if (indexToUpdate !== -1) {
				const updatedUser = { ...productsData[indexToUpdate], ...dto };
				productsData[indexToUpdate] = updatedUser;

				resolve(updatedUser);
			} else {
				reject(new Error(`Product with id ${dto.id} doesn't exist`));
			}
		});
	};

	public delete = async (id: string): Promise<boolean> => {
		return new Promise((resolve, reject) => {
			const indexToDelete = productsData.findIndex((user) => user.id === id);
			if (indexToDelete !== -1) {
				productsData.splice(indexToDelete, 1);
				resolve(true);
			} else {
				reject(new Error(`Product with id ${id} doesn't exist`));
			}
		});
	};
}
export const productRepositoryArray = new ProductRepositoryArray();
