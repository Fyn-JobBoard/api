import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestAccountResolverMiddleware } from 'src/auth/middlewares/request-account-resolver/request-account-resolver.middleware';
import { AccountTypes } from 'src/common/enums/accountTypes';

/**
 * Return the current account if the user is logged in and the account.type match the given one
 */
export const Account = createParamDecorator(
  (type: undefined | AccountTypes, ctx: ExecutionContext) => {
    const account = RequestAccountResolverMiddleware.getRequestAccount(
      ctx.switchToHttp().getRequest(),
    );

    if (type === undefined || account?.type === type) {
      return account;
    }

    return undefined;
  },
);

export const AuthAccount = Account;
