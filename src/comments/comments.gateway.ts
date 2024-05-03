import { Server, Socket } from 'socket.io';
import { CommentCreateDto } from './dto/comment-create.dto';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

import { CommentService } from './comments.service';
import { Validator } from '../utils/validator';
import { plainToInstance } from 'class-transformer';

@injectable()
export class CommentsGateway {
	private io: Server;

	constructor(@inject(TYPES.CommentService) private commentsService: CommentService,) {
		this.io = new Server();
		this.setupEventListeners();
	}

	private setupEventListeners() {
		this.io.on('connection', (socket: Socket) => {
			console.log('Client connected');

			// Handle 'comment' event
			socket.on('comment', async (comment: CommentCreateDto) => {
				try {
					const  validationErrors = await this.validateCommentData(comment);
					if (validationErrors.length > 0) {
						socket.emit('commentError', { error: 'Validation failed', details: validationErrors });
						return;
					}
					const savedComment = await this.commentsService.createComment({
						...comment,
					});
					this.io.emit('newComment', savedComment);
				} catch (err: any) {
					socket.emit('commentError', { error: err.message });
				}
			});

			socket.on('getAllComments', async () => {
				const allComments = await this.commentsService.findAll();
				socket.emit('allComments', allComments);
			});
		});
	}

	private validateCommentData(commentData: CommentCreateDto): Promise<string[]> {

		const commentDto = plainToInstance(CommentCreateDto, commentData);
		return Validator.validateDto(commentDto);
	}

	public getSocketIOInstance(): Server {
		return this.io;
	}
}
