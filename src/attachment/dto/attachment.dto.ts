import { IsIn, IsNumber, IsString } from 'class-validator';

export class AttachmentDto {
	@IsString()
	public name: string;

	@IsString()
	@IsIn(['image/jpeg', 'image/gif', 'image/png', 'text/plain'])
	public type: string;

	@IsString()
	public path: string;

	@IsNumber()
	public size: number;
}
