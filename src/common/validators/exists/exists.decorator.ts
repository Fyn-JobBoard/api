import { registerDecorator, ValidatorOptions } from 'class-validator';
import { EntityTarget } from 'typeorm';
import { ExistsConstraint } from './exists.constraint';

/**
 * Verify that at least 1 entity has the corresponding value for the given column
 * @param entity Which entity you want to test
 * @param column What's the associed column (default: `id`)
 */
export function Exists<Entity>(
  entity: EntityTarget<Entity>,
  column?: string,
  options?: ValidatorOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [entity, column],
      validator: ExistsConstraint,
      options,
    });
  };
}
