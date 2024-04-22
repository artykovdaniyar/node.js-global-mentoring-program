export class OrderPaymentDto {
	constructor(
		readonly type: string,
		readonly address: any = '',
		readonly creditCard: any = '',
	) {}
}
