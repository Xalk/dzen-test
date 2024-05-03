import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { json, urlencoded } from 'body-parser';
import 'reflect-metadata';
import { IConfigService } from './config/config.service.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { PrismaService } from './database/prisma.service';
import { CommentController } from './comments/comments.controller';
import { CommentsGateway } from './comments/comments.gateway';
import { CommentService } from './comments/comments.service';



@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.CommentController) private commentController: CommentController,
		@inject(TYPES.CommentService) private commentService: CommentService,
		@inject(TYPES.CommentsGateway) private commentsGateway: CommentsGateway,
		@inject(TYPES.ExeptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
		this.app.use(urlencoded({ extended: true }));
		this.app.use("/uploads", express.static("uploads"));
	}

	useRoutes(): void {
		this.app.use('/', this.commentController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.commentsGateway.getSocketIOInstance().attach(this.server)
		this.logger.log(`Server launched at http://localhost:${this.port}`);
	}

	public close(): void {
		this.server.close();
	}
}
