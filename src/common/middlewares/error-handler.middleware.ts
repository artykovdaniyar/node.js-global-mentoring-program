import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../../shared';
import { HTTPError } from '../../shared/entities/http-error.entity';

export class ErrorHandlerMiddleware {
	execute = (error: HTTPError | Error, _: Request, res: Response, next: NextFunction): void => {
		if (error instanceof HTTPError) {
			res.status(error.statusCode).json({
				data: null,
				error: {
					message: error.message,
				},
			});
		} else {
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
				data: null,
				error: {
					message: error.message,
				},
			});
		}

		next();
	};
}

export const errorHandlerMiddleware = new ErrorHandlerMiddleware();
