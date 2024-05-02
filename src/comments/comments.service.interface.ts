import { CommentModel } from '@prisma/client';
import { CommentCreateDto } from './dto/comment-create.dto';
import { GetAllCommentsOptions } from './comments.repository';

export interface ICommentService {
	createComment: (dto: CommentCreateDto) => Promise<CommentModel | null>;
	findAll: (options?: GetAllCommentsOptions) => Promise<CommentModel[]>;
}
