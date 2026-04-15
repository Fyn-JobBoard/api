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
import { Auth } from 'src/auth/class/auth.class';

@Injectable()
export class RequestAccountResolverMiddleware implements NestMiddleware {
  private static REQUEST_KEY_STORE = 'account';

  /**
   * Get the given request's account.
   *
   * Note that the middleware must have been use to make this method return the account.
   * @returns `undefined` if the middleware has not been used or the request's user is not logged in.
   */
  public static getRequestAuth(req: Request): Auth | undefined {
    if (
      this.REQUEST_KEY_STORE in req &&
      req[this.REQUEST_KEY_STORE] instanceof Auth
    ) {
      return req[this.REQUEST_KEY_STORE] as Auth;
    }

    return undefined;
  }

  public static async getRequestAccount(
    req: Request,
  ): Promise<Account | undefined> {
    const auth = RequestAccountResolverMiddleware.getRequestAuth(req);
    return auth?.account();
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

    let auth: Auth | null = null;

    const destructured = authorization.split(/\s+/, 2).map((v) => v.trim());
    if (destructured.length !== 2) {
      throw new BadRequestException('Bad authorization header format.');
    }

    const [type, value] = destructured;

    switch (type.toLowerCase()) {
      case 'bearer': {
        auth = await this.authService.authenticate({ jwt: value });

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
        auth = await this.authService.authenticate({ email, password });

        break;
      }
      default: {
        throw new NotImplementedException(
          `The ${type} authorization is not valid or not implemented.`,
        );
      }
    }

    if (auth) {
      Object.defineProperty(
        req,
        RequestAccountResolverMiddleware.REQUEST_KEY_STORE,
        {
          value: auth,
          writable: false,
        },
      );
    }

    next();
  }
}
