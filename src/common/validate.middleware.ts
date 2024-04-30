import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class ValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {
	}

	execute({ body }: Request, res: Response, next: NextFunction): void {
		const instance = plainToInstance(this.classToValidate, body);
		validate(instance).then((errors) => {
			if (errors.length > 0) {
				const validationErrors = this.transformErrors(errors);
				res.status(422).send(validationErrors);
			} else {
				next();
			}
		});
	}

	private transformErrors(errors: any[]): any {
		const transformedErrors: any = {};

		errors.forEach((error) => {
			const property = error.property;
			const constraints = error.constraints;

			transformedErrors[property] = Object.values(constraints)[0];
		});

		return transformedErrors;
	}
}
