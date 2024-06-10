import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode, IMiddleware } from '../../shared';
import { IUserService } from '../../api/user/service/user.service.interface';

export class AuthMiddleware implements IMiddleware {
	constructor(private userService: IUserService) {}

	execute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const userId = req.headers['x-user-id'];
		if (!userId) {
			res.status(HttpStatusCode.FORBIDDEN).json({
				data: null,
				error: {
					message: 'User is not authorized',
				},
			});
			return;
		}

		try {
			const user = await this.userService.getOne(userId as string);
			req.body.user = user;
		} catch (error) {
			res.status(HttpStatusCode.UNAUTHORIZED).json({
				data: null,
				error: {
					message: 'You must be authorized user',
				},
			});
		}

		next();
	};
}
