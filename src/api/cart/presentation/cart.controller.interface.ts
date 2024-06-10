import { Request, Response } from 'express';
import { BaseController } from '../../../common';

export interface ICartController extends BaseController {
	getOne(req: Request, res: Response): Promise<void>;
	update(req: Request, res: Response): Promise<void>;
	empty(req: Request, res: Response): Promise<void>;
	checkout(req: Request, res: Response): Promise<void>;
}
