import { IsEmail, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AttachmentDto } from '../../attachment/dto/attachment.dto';
import { SanitizeHTML } from '../../utils/sanitize-html-decorator';

export class CommentCreateDto {
	@IsEmail({}, { message: 'Invalid email address' })
	email: string;

	@IsString()
	userName: string;

	@IsString()
	@SanitizeHTML()
	text: string;

	@IsOptional()
	@IsNumber()
	public parentId?: number;

	@IsOptional()
	@ValidateNested()
	@Type(() => AttachmentDto)
	public attachment?: AttachmentDto;
}
