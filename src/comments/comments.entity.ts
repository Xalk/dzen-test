export class Comment {

	constructor(
		private readonly _email: string,
		private readonly _userName: string,
		private readonly _text: string,
		private readonly _parentId?: number
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

}
