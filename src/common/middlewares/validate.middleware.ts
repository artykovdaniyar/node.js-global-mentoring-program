import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { HttpStatusCode, IMiddleware } from '../../shared';

export class ValidateMiddleware implements IMiddleware {
	constructor(
		private schema: Joi.ObjectSchema,
		private validateKey = 'body',
	) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		const dataToValidate = req[this.validateKey];
		const { error } = this.schema.validate(dataToValidate);

		if (error) {
			const response = {
				data: null,
				error: { message: error.details[0].message },
			};

			res.type('application/json');
			res.status(HttpStatusCode.UNPROCESSABLE_ENTITY).json(response);
		} else {
			next();
		}
	}
}
