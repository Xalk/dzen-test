export class Attachment {
	constructor(
		private readonly _name: string,
		private readonly _type: string,
		private readonly _path: string,
		private readonly _size: number
	) {}

	get name(): string {
		return this._name;
	}

	get type(): string {
		return this._type;
	}

	get path(): string {
		return this._path;
	}

	get size(): number {
		return this._size;
	}
}
