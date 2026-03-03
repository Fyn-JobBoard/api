import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Account as AccountEntity } from 'src/accounts/entities/account.entity';
import { AccountTypes } from 'src/common/enums/accountTypes';

/**
 * Return the current account if the user is logged in and the account.type match the given one
 */
export const Account = createParamDecorator(
  (type: undefined | AccountTypes, ctx: ExecutionContext) => {
    const { account } = ctx
      .switchToHttp()
      .getRequest<Request & { account?: AccountEntity }>();

    if (type === undefined || account?.type === type) {
      return account;
    }

    return undefined;
  },
);

export const AuthAccount = Account;
