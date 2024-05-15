import { Request, Response, NextFunction } from 'express';

export const awaitedCallback =
	(callback) => async (req: Request, res: Response, next: NextFunction) => {
		try {
			await callback(req, res);
		} catch (error: any) {
			next(error);
		}
	};
