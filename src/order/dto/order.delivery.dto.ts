export class OrderDeliveryDto {
	constructor(
		readonly type: string,
		readonly address: any = '',
	) {}
}
