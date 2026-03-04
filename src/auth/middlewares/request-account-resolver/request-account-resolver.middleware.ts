import {
  BadRequestException,
  Inject,
  Injectable,
  NestMiddleware,
  NotImplementedException,
} from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { Account } from 'src/accounts/entities/account.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class RequestAccountResolverMiddleware implements NestMiddleware {
  private static REQUEST_KEY_STORE = 'account';

  /**
   * Get the given request's account.
   *
   * Note that the middleware must have been use to make this method return the account.
   * @returns `undefined` if the middleware has not been used or the request's user is not logged in.
   */
  public static getRequestAccount(req: Request): Account | undefined {
    if (
      this.REQUEST_KEY_STORE in req &&
      req[this.REQUEST_KEY_STORE] instanceof Account
    ) {
      return req[this.REQUEST_KEY_STORE] as Account;
    }

    return undefined;
  }

  constructor(
    @Inject(AuthService)
    private authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header('authorization');
    if (!authorization) {
      return next();
    }

    let account: Account | null = null;

    const destructured = authorization.split(/\s+/, 2).map((v) => v.trim());
    if (destructured.length !== 2) {
      throw new BadRequestException('Bad authorization header format.');
    }

    const [type, value] = destructured;

    switch (type.toLowerCase()) {
      case 'bearer': {
        account = await this.authService.validate(value);

        break;
      }
      case 'basic': {
        const decoded = Buffer.from(value, 'base64').toString();
        if (!decoded.includes(':')) {
          throw new BadRequestException(
            'Basic authorization must have the email:password syntax.',
          );
        }

        const [email, password] = decoded.split(':', 2);
        account = await this.authService
          .loginIn(email, password)
          .then((result) => result?.account ?? null);

        break;
      }
      default: {
        throw new NotImplementedException(
          `The ${type} authorization is not valid or not implemented.`,
        );
      }
    }

    if (account) {
      Object.defineProperty(
        req,
        RequestAccountResolverMiddleware.REQUEST_KEY_STORE,
        {
          value: account,
          writable: false,
        },
      );
    }

    next();
  }
}
