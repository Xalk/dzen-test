import { CommentModel } from '@prisma/client';
import { Comment } from './comments.entity';
import { GetAllCommentsOptions } from './comments.repository';

export interface ICommentRepository {
	create: (comment: Comment) => Promise<CommentModel>;
	findAll: (options?: GetAllCommentsOptions) => Promise<CommentModel[]>;
}
