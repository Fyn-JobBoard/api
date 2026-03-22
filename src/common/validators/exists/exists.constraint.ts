import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import assert from 'node:assert';
import {
  EntityManager,
  EntitySchema,
  EntityTarget,
  FindOptionsWhere,
  ObjectLiteral,
} from 'typeorm';

@ValidatorConstraint({ async: true })
export class ExistsConstraint<
  Entity extends ObjectLiteral,
> implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  private extractConstraints(validationArguments?: ValidationArguments) {
    const [entity, column = 'id'] = (validationArguments?.constraints ?? [
      null,
    ]) as [EntityTarget<Entity> | null, string | undefined];

    assert(entity !== null, 'Invalid provided entity class.');

    return {
      entity,
      column,
    };
  }

  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const { entity, column } = this.extractConstraints(validationArguments);

    const repository = this.entityManager.getRepository(entity);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const filter = { [column]: value } as FindOptionsWhere<Entity>;

    return repository.existsBy(filter);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const { entity } = this.extractConstraints(validationArguments);

    const name =
      typeof entity === 'string'
        ? entity
        : entity instanceof EntitySchema
          ? entity.options.name
          : 'name' in entity
            ? entity.name
            : null;

    if (name) {
      return `${validationArguments?.property} references an invalid ${name}`;
    } else {
      return `${validationArguments?.property}'s related entity has not been found`;
    }
  }
}
