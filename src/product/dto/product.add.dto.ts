export class AddProductPropDto {
	constructor(
		readonly title: string,
		readonly description: string,
		readonly price: number,
	) {}
}
