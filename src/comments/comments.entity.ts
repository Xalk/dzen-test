import { Attachment } from '../attachment/attachment.entity';

export class Comment {

	constructor(
		private readonly _email: string,
		private readonly _userName: string,
		private readonly _text: string,
		private readonly _parentId?: number,
		private readonly _attachment?: Attachment,
	) {

	}

	get email(): string {
		return this._email;
	}

	get userName(): string {
		return this._userName;
	}

	get text(): string {
		return this._text;
	}

	get parentId(): number | undefined {
		return this._parentId;
	}

	get attachment(): Attachment | undefined {
		return this._attachment;
	}

}
