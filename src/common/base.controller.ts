import { Router, Response } from 'express';
import { IControllerRoute } from '../shared/typings/route.types';

export abstract class BaseController {
	private readonly _router: Router;
	constructor() {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	protected bindRoutes = (routes: IControllerRoute[]): void => {
		for (const route of routes) {
			const handler = route.func;
			this.router[route.method](route.path, handler);
		}
	};
}
