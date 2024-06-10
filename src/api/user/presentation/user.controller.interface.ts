import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../../../common';

export interface IUserController extends BaseController {
	getAll(_: Request, res: Response, next: NextFunction): Promise<void>;
	add(req: Request, res: Response, next: NextFunction): Promise<void>;
	remove(req: Request, res: Response): Promise<void>;
	getHobbies(req: Request, res: Response): Promise<void>;
	updateHobbies(req: Request, res: Response): Promise<void>;
}
