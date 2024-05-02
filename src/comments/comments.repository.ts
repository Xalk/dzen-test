import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { ICommentRepository } from './comments.repository.interface';
import { CommentModel } from '@prisma/client';
import { Comment } from './comments.entity';


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

	async findAll(): Promise<CommentModel[]> {
		return this.prismaService.client.commentModel.findMany({
			where: {
				parentId: null,
			},
			include: {
				attachment: true,
				nestedComments: {
					include: {
						nestedComments: {
							include: {
								nestedComments: {
									include: {
										nestedComments: {
											include: {
												nestedComments: true,
											},
										},
									},
								},
							},
						},
					},
				},
			},
		});
	}


}
