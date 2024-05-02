import { ICommentService } from './comments.service.interface';
import { CommentCreateDto } from './dto/comment-create.dto';
import { CommentModel } from '@prisma/client';
import { ICommentRepository } from './comments.repository.interface';
import { TYPES } from '../types';
import { inject, injectable } from 'inversify';
import { Comment } from './comments.entity';
import { Attachment } from '../attachment/attachment.entity';

@injectable()
export class CommentService implements ICommentService {
	constructor(@inject(TYPES.CommentRepository) private commentRepository: ICommentRepository) {
	}


	createComment({ email, text, userName, parentId, attachment }: CommentCreateDto): Promise<CommentModel | null> {
		const createdAttachment = attachment ? new Attachment(attachment.name, attachment.type, attachment.path, attachment.size) : undefined;
		const comment = new Comment(email, userName, text, Number(parentId), createdAttachment);
		return this.commentRepository.create(comment);
	}

	async findAll(): Promise<CommentModel[]> {

		const allComments = await this.commentRepository.findAll();

		const commentDictionary: { [key: number]: CommentModel & { nestedComments: CommentModel[] } } = {};
		const commentsHierarchy: CommentModel[] = [];

		allComments.forEach((comment) => {
			commentDictionary[comment.id] = { ...comment, nestedComments: [] };
		});

		allComments.forEach((comment) => {
			if (comment.parentId === null) {
				commentsHierarchy.push(commentDictionary[comment.id]);
			} else if (commentDictionary[comment.parentId]) {
				commentDictionary[comment.parentId].nestedComments.push(commentDictionary[comment.id]);
			}
		});

		return commentsHierarchy;
	}

}
