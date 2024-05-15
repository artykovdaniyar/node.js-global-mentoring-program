import { HttpStatusCode } from '../types';

export class HTTPError extends Error {
	statusCode: HttpStatusCode;

	constructor(statusCode: number, message: string) {
		super(message);
		this.statusCode = statusCode;
		this.message = message;
	}
}
