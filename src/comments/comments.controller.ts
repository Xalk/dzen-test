import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { ICommentController } from './comments.controller.interface';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { ICommentService } from './comments.service.interface';
import { CommentCreateDto } from './dto/comment-create.dto';
import { ValidateMiddleware } from '../common/validate.middleware';
import { HttpError } from '../errors/http-error.class';

@injectable()
export class CommentController extends BaseController implements ICommentController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.CommentService) private commentService: ICommentService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/',
				method: 'post',
				func: this.create,
				middlewares: [new ValidateMiddleware(CommentCreateDto)],
			},
			{
				path: '/',
				method: 'get',
				func: this.findAll,
				middlewares: [],
			},
		]);
	}

	async create({ body }: Request<{}, {}, CommentCreateDto>, res: Response, next: NextFunction): Promise<void> {
		const result = await this.commentService.createComment(body);

		if (!result) {
			return next(new HttpError(400, 'Comment not created'));
		}

		this.ok(res, result);
	}


	async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
		const result = await this.commentService.findAll();
		this.ok(res, result);
	}

}
