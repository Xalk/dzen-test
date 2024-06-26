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
import { UploadMiddleware } from '../common/upload.middleware';
import { GetAllCommentsOptions } from './comments.repository';


@injectable()
export class CommentController extends BaseController implements ICommentController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.CommentService) private commentService: ICommentService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/comments',
				method: 'post',
				func: this.create,
				middlewares: [new UploadMiddleware(), new ValidateMiddleware(CommentCreateDto)],
			},
			{
				path: '/comments',
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
		const { page = '1', limit = '25', orderBy = 'desc' } = req.query;
		const options: GetAllCommentsOptions = {
			page: parseInt(page as string, 10),
			limit: parseInt(limit as string, 10),
			orderBy: orderBy as 'asc' | 'desc',
		};
		const result = await this.commentService.findAll(options);
		this.ok(res, result);
	}

}
