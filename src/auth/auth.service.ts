import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/accounts/entities/account.entity';
import { Repository } from 'typeorm';
import { JWTContent } from './types/jwt-content';

@Injectable()
export class AuthService {
  constructor(
    @Inject()
    private readonly jwtService: JwtService,
    @InjectRepository(Account)
    private readonly accounts: Repository<Account>,
  ) {}

  /**
   * Get or create the jwt of the given account
   * @param force_new If `true`, invalidate the account's previous jwt and return a new one
   */
  public async jwtOf(account: Account, force_new: boolean = false) {
    const jwt_version =
      force_new || account.jwt_version === null
        ? await this.invalidateJwtsOf(account)
        : account.jwt_version;

    return this.jwtService.signAsync({
      id: account.id,
      type: account.type,
      version: jwt_version,
    } satisfies JWTContent);
  }

  /**
   * Invalidate all the JWTs of the given account and return the new JWT's version for this account
   * If the account does not have a jwt_version (= value is `null`), then create it and set it to `0`
   */
  public async invalidateJwtsOf(account: Account): Promise<number> {
    const { jwt_version } = await this.accounts.findOneByOrFail({
      id: account.id,
    });
    account.jwt_version = typeof jwt_version === 'number' ? jwt_version + 1 : 0;
    await this.accounts.save(account);

    return account.jwt_version;
  }

  /**
   * Decode the given JWT or return `null` if the jwt is invalid.
   * @important This method does not check for the jwt's version
   */
  public async decode(jwt: string): Promise<JWTContent | null> {
    return this.jwtService.verifyAsync(jwt).catch(() => null);
  }

  /**
   * Validate the given jwt/jwt content and return the associed account (if the jwt is valid)
   */
  public async validate(jwt: string | JWTContent): Promise<Account | null> {
    if (typeof jwt === 'string') {
      const decoded = await this.decode(jwt);
      if (!decoded) return decoded;
      jwt = decoded;
    }

    const account = await this.accounts.findOneBy({ id: jwt.id });
    if (
      account &&
      account.type === jwt.type &&
      account.jwt_version === jwt.version
    ) {
      return account;
    }

    return null;
  }
}
