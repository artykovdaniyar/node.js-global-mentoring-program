import { Router, Response } from 'express';
import { ExpressReturnType, HttpStatusCode, IControllerRoute } from '../shared';

export abstract class BaseController {
	private readonly _router: Router;
	constructor() {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): ExpressReturnType {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, HttpStatusCode.OK, message);
	}

	protected error = (res: Response, code: number, error: any): ExpressReturnType => {
		const response = {
			data: null,
			error: error.message,
		};

		res.type('application/json');
		return res.status(code).json(response);
	};

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.func.bind(this);
			const pipline = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, pipline);
		}
	}
}
