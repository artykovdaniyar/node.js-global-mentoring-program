import { Request, Response } from 'express';
import { BaseController } from '../../common';

export class UserController extends BaseController {
	constructor() {
		super();
		this.bindRoutes([
			{
				path: '/',
				method: 'get',
				func: this.handler,
			},
		]);
	}

	handler = (_: Request, res: Response) => {
		res.type('application/json');
		return res.send('Hello, I am User');
	};
}

export const userController = new UserController();
