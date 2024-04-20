import { NextFunction, Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { HttpStatusCode, IMiddleware } from '../shared';

export class AuthMiddleware implements IMiddleware {
	constructor(private userService: UserService) {}

	execute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const userId = req.headers['x-user-id'];
		if (!userId) {
			res.status(HttpStatusCode.FORBIDDEN).json({
				data: null,
				error: 'You must be authorized user',
			});
		}

		let user;
		try {
			user = await this.userService.getOne(userId as string);
		} catch (error) {
			res.status(HttpStatusCode.UNAUTHORIZED).json({
				data: null,
				error: 'User is not authorized',
			});
		}

		req.body.user = user;
		next();
	};
}
