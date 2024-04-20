import { Cart } from './cart.entity';

export const cartsData: Cart[] = [
	{
		id: 'df1b5e95-6fd7-4a3a-b018-5c0a460c3e63',
		userId: 'd0311f4f-2fa9-462b-8b56-8fed02924d2d',
		isDeleted: false,
		items: [
			{
				product: {
					id: 'dba716f5-49dc-4a8a-84d7-1f5c6728488f',
					title: 'Microsoft Surface Laptop 4',
					description:
						'Style and speed. Stand out on HD video calls backed by Studio Mics. Capture ideas on the vibrant touchscreen.',
					price: 1499,
				},
				count: 2,
			},

			{
				product: {
					id: 'fc8b7022-7bc4-4d94-b246-cb4fd6a3e6a0',
					title: 'Infinix INBOOK',
					description: 'Infinix Inbook X1 Ci3 10th 8GB 256GB 14 Win10 Grey – 1 Year Warranty',
					price: 1099,
				},
				count: 1,
			},
		],
	},
];
