import { CommentModel } from '@prisma/client';
import { CommentCreateDto } from './dto/comment-create.dto';

export interface ICommentService {
	createComment: (dto: CommentCreateDto) => Promise<CommentModel | null>;
	findAll: () => Promise<CommentModel[]>
}
