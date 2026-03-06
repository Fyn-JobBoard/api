import {
  CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import assert from 'assert';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entities/account.entity';
import { Managed } from 'src/accounts/entities/managed.entity';
import { RequestAccountResolverMiddleware } from 'src/auth/middlewares/request-account-resolver/request-account-resolver.middleware';
import { AccountTypes } from 'src/common/enums/accountTypes';
import PermissionManager from 'src/common/utils/permissionManager';
import { IsA } from './decorators/is-a/is-a.decorator';
import {
  IsManagedAnd,
  type IsManagedPredicates,
} from './decorators/is-managed-and/is-managed-and.decorator';

/**
 * Checks if the request has been made by a logged user.
 *
 * You can affinate the verification with the following decorators :
 *
 * - `@IsA(AccountTypes[])` -> Check if the logged user's type is in the given account types array
 * - `@IsManagedAnd({
 *  permissions?: (manager) => boolean,
 *  author?: Account | ((context) => Account)
 * })` -> Verify if the account is a managed account, and if so, check for its permissions and/or its author. If author is `'system'`, the managed account must be a system account.
 */
@Injectable()
export class IsLoggedGuard implements CanActivate {
  constructor(
    @Inject(Reflector)
    private reflector: Reflector,
    @Inject(AccountsService)
    private accountServices: AccountsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const auth = RequestAccountResolverMiddleware.getRequestAccount(
      context.switchToHttp().getRequest(),
    );

    if (!(auth instanceof Account)) {
      return false;
    }
    const handler = context.getHandler();

    const accepted: AccountTypes[] | undefined = this.reflector.get(
      IsA,
      handler,
    );
    if (accepted && !accepted.includes(auth.type)) {
      return false;
    }

    const managed_predicates: IsManagedPredicates | undefined =
      this.reflector.get(IsManagedAnd, handler);

    if (managed_predicates && auth.type === AccountTypes.Managed) {
      const managed = await this.accountServices.getModelOf(auth);
      assert(managed instanceof Managed);

      if (
        managed_predicates.permissions &&
        !managed_predicates.permissions(
          new PermissionManager(managed.permissions),
        )
      ) {
        return false;
      }

      if (managed_predicates.author) {
        const given_author =
          typeof managed_predicates.author === 'function'
            ? managed_predicates.author(context)
            : managed_predicates.author;

        const expected_id =
          given_author === 'system' ? undefined : given_author.id;

        if (managed.author?.id !== expected_id) {
          return false;
        }
      }
    }

    return true;
  }
}
