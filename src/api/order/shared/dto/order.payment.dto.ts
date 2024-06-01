export class OrderPaymentDto {
	constructor(
		public readonly type: string,
		public readonly address: any = '',
		public readonly creditCard: any = '',
	) {}
}
