export class OrderDeliveryDto {
	constructor(
		public readonly type: string,
		public readonly address: any = '',
	) {}
}
