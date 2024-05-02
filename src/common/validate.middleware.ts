import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';


interface ValidationErrorMessage {
	[key: string]: string | ValidationErrorMessage;
}

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

	private transformErrors(errors: ValidationError[]): ValidationErrorMessage {
		const transformedErrors: ValidationErrorMessage = {};

		errors.forEach((error) => {
			const property = error.property;
			const constraints = error.constraints;

			if (property === 'attachment') {
				error.children?.forEach((childError) => {
					const childProperty = childError.property;
					const childConstraints = childError.constraints;
					const constraintMessage = this.getConstraintMessage(childConstraints);

					if (!transformedErrors[property]) {
						transformedErrors[property] = {};
					}

					(transformedErrors[property] as ValidationErrorMessage)[childProperty] = constraintMessage;
				});
			} else {
				const constraintMessage = this.getConstraintMessage(constraints);
				transformedErrors[property] = constraintMessage;
			}
		});

		return transformedErrors;
	}

	private getConstraintMessage(constraints?: { [key: string]: string }): string {
		const constraintMessages = Object.values(constraints as any);
		return constraintMessages.join(', ');
	}
}
