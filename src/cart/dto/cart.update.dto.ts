export class UpdateCartDto {
	constructor(
		readonly userId: string,
		readonly productId: string,
		readonly count: number,
	) {}
}
