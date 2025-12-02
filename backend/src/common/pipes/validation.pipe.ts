import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const validationPipe = new ValidationPipe({
  whitelist: true, // Strip non-whitelisted properties
  forbidNonWhitelisted: true, // Throw error on non-whitelisted properties
  transform: true, // Auto-transform payloads to DTO instances
  transformOptions: {
    enableImplicitConversion: true,
  },
  disableErrorMessages: process.env.NODE_ENV === 'production', // Hide detailed errors in production
  validationError: {
    target: false, // Don't expose target object
    value: false, // Don't expose submitted values
  },
  exceptionFactory: (errors: ValidationError[]) => {
    const messages = errors.map((error) => ({
      field: error.property,
      errors: Object.values(error.constraints || {}),
    }));
    return new BadRequestException({
      statusCode: 400,
      message: 'Validation failed',
      errors: messages,
    });
  },
});
