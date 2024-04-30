import { ICommentService } from './comments.service.interface';
import { CommentCreateDto } from './dto/comment-create.dto';
import { CommentModel } from '@prisma/client';
import { ICommentRepository } from './comments.repository.interface';
import { TYPES } from '../types';
import { inject, injectable } from 'inversify';
import { Comment } from './comments.entity';

@injectable()
export class CommentService implements ICommentService {
	constructor(@inject(TYPES.CommentRepository) private commentRepository: ICommentRepository) {
	}


	createComment({ email, text, userName, parentId }: CommentCreateDto): Promise<CommentModel | null> {
		const comment = new Comment(email, userName, text, parentId);
		return this.commentRepository.create(comment);
	}

	findAll(): Promise<CommentModel[]> {
		return this.commentRepository.findAll();
	}

}
