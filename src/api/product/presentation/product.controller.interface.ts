import { Request, Response } from 'express';
import { BaseController } from '../../../common';

export interface IProductController extends BaseController {
	getAll(_: Request, res: Response): Promise<void>;
	getOne(req: Request, res: Response): Promise<void>;
}
