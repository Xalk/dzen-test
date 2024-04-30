import { IsEmail, IsString } from 'class-validator';

export class CommentCreateDto {
	@IsEmail({}, { message: 'Invalid email address' })
	email: string;

	@IsString()
	userName: string;

	@IsString()
	text: string;
}
