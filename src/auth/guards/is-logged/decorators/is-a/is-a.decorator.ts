import { Reflector } from '@nestjs/core';
import type { AccountTypes } from 'src/common/enums/accountTypes';

/**
 * If the `LoggedGuard` is used, check if the logged account's type match one of the given account types.
 */
export const IsA = Reflector.createDecorator<AccountTypes[]>();
