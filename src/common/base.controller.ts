import { IncomingMessage, ServerResponse } from 'http';
import { IControllerRoute, IRouteController } from '../share/typings/route.types';
import { IControllerResponse } from '../share/typings/controller.types';

export abstract class BaseController {
	constructor() {}
	private _routers: IControllerRoute[] = [];

	public router = (req: IncomingMessage, res: ServerResponse, pathName?: string) => {
		const url = pathName || req.url || '';
		const method = req.method || '';
		const controller = this.matchRoutes(url, method);

		if (controller) {
			return controller(req, res, url);
		}
		res.writeHead(404, { 'Content-Type': 'application/json' });
		const response = {
			data: null,
			error: 'Page Not Found',
		};
		res.end(JSON.stringify(response));
	};

	private matchRoutes = (url: string, method: string): IRouteController | undefined => {
		const route = this._routers.find((route) => {
			const urlRegex = new RegExp(route?.pattern || '');

			if (urlRegex.test(url) && route.method === method) {
				return route;
			}
		});
		return route?.controller;
	};

	protected bindRoutes = (routers: IControllerRoute[]) => {
		this._routers = routers;
	};

	protected parseRequestBody = <T>(req: IncomingMessage): Promise<T> =>
		new Promise((resolve, reject) => {
			let body = '';

			req.on('data', (chunk) => {
				body += chunk.toString();
			});

			req.on('end', () => {
				resolve(JSON.parse(body));
			});

			req.on('error', (error: Error) => {
				reject(error);
			});
		});

	protected handleSuccessResponse = (
		res: ServerResponse,
		response: IControllerResponse,
		code = 200,
	) => {
		res.writeHead(code, {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=3600',
		});
		res.end(JSON.stringify(response));
	};

	protected handleFailResponse = (res: ServerResponse, code: number, error: any) => {
		res.writeHead(code, { 'Content-Type': 'application/json' });
		const response = {
			data: null,
			error: error.message,
		};

		res.end(JSON.stringify(response));
	};
}
