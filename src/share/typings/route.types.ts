import { IncomingMessage, ServerResponse } from 'http';

type HttpMehtods = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export type IRouteController = (
	req: IncomingMessage,
	res: ServerResponse,
	pathname?: string,
) => void;

export interface IRoute {
	url: string;
	controller: IRouteController;
}

export interface IControllerRoute {
	controller: IRouteController;
	method: HttpMehtods;
	pattern: string;
}
