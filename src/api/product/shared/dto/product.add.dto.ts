export class AddProductPropDto {
	constructor(
		public readonly title: string,
		public readonly description: string,
		public readonly price: number,
	) {}
}
