import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode, IMiddleware } from '../shared';

export class AdminMiddleware implements IMiddleware {
	constructor() {}

	execute = (req: Request, res: Response, next: NextFunction): void => {
		const userId = req.headers['x-user-id'];
		if (!userId) {
			res.status(HttpStatusCode.FORBIDDEN).json({
				data: null,
				error: 'You must be authorized user',
			});
		}

		if (userId !== 'admin') {
			res.status(HttpStatusCode.FORBIDDEN).json({
				data: null,
				error: 'User is not admin',
			});
		}
		next();
	};
}
