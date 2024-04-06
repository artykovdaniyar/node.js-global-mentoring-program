import http, { IncomingMessage, ServerResponse } from 'http';
import { userController } from './infrastucture/controllers/user.controller';
import { IRoute, IRouteController } from './share/typings/route.types';

export class App {
	private routes: IRoute[] = [];
	private defualtRoute: string = '/api';
	constructor() {}

	private useRoute(url: string, controller: IRouteController) {
		this.routes.push({
			url,
			controller,
		});
	}

	private initRoutes = (req: IncomingMessage, res: ServerResponse) => {
		const requestedUrl = req.url || '';
		const pathName = requestedUrl.replace(this.defualtRoute, '');
		const url = pathName || requestedUrl;

		this.routes.forEach((route) => {
			if (route.url === url || url.startsWith(route.url)) {
				return route.controller(req, res, url);
			}

			res.writeHead(404, { 'Content-Type': 'application/json' });
			const response = {
				data: null,
				error: 'Error: Page Not Found',
			};
			res.end(JSON.stringify(response));
		});
	};

	public init() {
		this.useRoute('/users', userController.router);
		http
			.createServer((req: IncomingMessage, res: ServerResponse) => this.initRoutes(req, res))
			.listen(8000, function () {
				console.log('server start at port 8000');
			});
	}
}
