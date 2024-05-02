import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { ExeptionFilter } from './errors/exception.filter';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { PrismaService } from './database/prisma.service';
import { ICommentController } from './comments/comments.controller.interface';
import { ICommentService } from './comments/comments.service.interface';
import { ICommentRepository } from './comments/comments.repository.interface';
import { CommentController } from './comments/comments.controller';
import { CommentService } from './comments/comments.service';
import { CommentRepository } from './comments/comments.repository';
import { CommentsGateway } from './comments/comments.gateway';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<ICommentController>(TYPES.CommentController).to(CommentController);
	bind<CommentsGateway>(TYPES.CommentsGateway).to(CommentsGateway);
	bind<ICommentService>(TYPES.CommentService).to(CommentService);
	bind<ICommentRepository>(TYPES.CommentRepository).to(CommentRepository).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();

	bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { appContainer, app };
}

export const boot = bootstrap();
