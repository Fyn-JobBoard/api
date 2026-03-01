import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Account } from 'src/accounts/entities/account.entity';
import type PermissionManager from 'src/common/utils/permissionManager';

export interface IsManagedPredicates {
  permissions?: (permissions: PermissionManager) => boolean;
  author?:
    | 'system'
    | Account
    | ((context: ExecutionContext) => Account | 'system');
}

/**
 * If the `LoggedGuard` is used and the logged account is a managed one,
 * check for the managed's permissions and author
 */
export const IsManagedAnd = Reflector.createDecorator<IsManagedPredicates>();
