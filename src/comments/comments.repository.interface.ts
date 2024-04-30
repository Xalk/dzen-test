import { CommentModel } from '@prisma/client';
import { Comment } from './comments.entity';

export interface ICommentRepository {
	create: (comment: Comment) => Promise<CommentModel>;
	findAll: () => Promise<CommentModel[]>;
}
