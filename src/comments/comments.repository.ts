import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { ICommentRepository } from './comments.repository.interface';
import { CommentModel } from '@prisma/client';
import { Comment } from './comments.entity';

export interface GetAllCommentsOptions {
	page?: number;
	limit?: number;
	orderBy?: 'asc' | 'desc';
}

@injectable()
export class CommentRepository implements ICommentRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {
	}

	async create({ userName, email, text, parentId, attachment }: Comment): Promise<CommentModel> {
		return this.prismaService.client.commentModel.create({
			data: {
				userName,
				email,
				text,
				parentId,
				attachment: attachment
					? {
						create: {
							name: attachment.name,
							type: attachment.type,
							path: attachment.path,
							size: attachment.size,
						},
					}
					: undefined,
			},
			include: {
				attachment: true,
			},
		});
	}

	async findAll(options: GetAllCommentsOptions = {}): Promise<CommentModel[]> {
		const { page = 1, limit = 25, orderBy = 'desc'  } = options;
		return this.prismaService.client.commentModel.findMany({
			skip: (page - 1) * limit,
			take: limit,
			orderBy: {id: orderBy},
		});
	}


}
