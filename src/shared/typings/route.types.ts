import { NextFunction, RequestHandler, Response, Router } from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import { IMiddleware } from './middleware.interface';

export type HttpMehtods = 'get' | 'post' | 'patch' | 'delete' | 'put';

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
	path: string;
	func: RequestHandler;
	method: keyof Pick<Router, HttpMehtods>;
	middlewares?: IMiddleware[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
