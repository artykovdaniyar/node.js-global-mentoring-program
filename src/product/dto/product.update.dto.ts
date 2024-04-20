export class UpdateProductDto {
	constructor(
		readonly id: string,
		readonly title: string,
		readonly description: string,
		readonly price: number,
	) {}
}
