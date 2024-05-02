import { validate } from 'class-validator';

export class Validator {
	static async validateDto(dto: object): Promise<string[]> {
		const errors = await validate(dto);
		return errors.map(error => Object.values(error.constraints || {})).flat();
	}


}
