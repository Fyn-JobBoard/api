import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestAccountResolverMiddleware } from 'src/auth/middlewares/request-account-resolver/request-account-resolver.middleware';
import { AccountTypes } from 'src/common/enums/accountTypes';

/**
 * Return the current account if the user is logged in and the account.type match the given one
 */
export const Authenticated = createParamDecorator(
  (type: undefined | AccountTypes, ctx: ExecutionContext) => {
    const auth = RequestAccountResolverMiddleware.getRequestAuth(
      ctx.switchToHttp().getRequest(),
    );

    if (auth && (type === undefined || auth.type === type)) {
      return auth;
    }

    return undefined;
  },
);

export const AuthAccount = Authenticated;
