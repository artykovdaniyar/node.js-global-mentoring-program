import { ICartRepository } from '../shared/cart.types';

export const cartsData: ICartRepository[] = [
	{
		_id: 'df1b5e95-6fd7-4a3a-b018-5c0a460c3e63',
		userId: 'b95d88a7-6ba0-4595-a247-84d3cf008a0d',
		isDeleted: false,
		items: [
			{
				product: 'dba716f5-49dc-4a8a-84d7-1f5c6728488f',
				count: 2,
			},

			{
				product: 'fc8b7022-7bc4-4d94-b246-cb4fd6a3e6a0',
				count: 1,
			},
		],
	},
];
