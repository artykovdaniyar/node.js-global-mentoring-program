export class ReturnProductDto {
	constructor(
		public readonly id: string,
		public readonly title: string,
		public readonly description: string,
		public readonly price: number,
	) {}
}
