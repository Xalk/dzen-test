import { NextFunction, Request, Response } from 'express';

export interface ICommentController {
	create: (req: Request, res: Response, next: NextFunction) => void;
	findAll: (req: Request, res: Response, next: NextFunction) => void;
}
