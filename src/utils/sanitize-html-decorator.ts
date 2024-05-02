import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import sanitizeHtml from 'sanitize-html';

export function SanitizeHTML(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'sanitizeHTML',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const sanitizedValue = sanitizeHtml(value, {
						allowedTags: ['a', 'code', 'i', 'strong'],
					});
					return sanitizedValue === value;
				},
				defaultMessage(args: ValidationArguments) {
					return `${args.property} contains invalid HTML content`;
				},
			},
		});
	};
}
