import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/accounts/entities/account.entity';
import { Repository } from 'typeorm';
import type { BaseJWTContent, JWTContent } from '../types/jwt-content';

@Injectable()
export class Auth {
  private cached_account: Account | null = null;
  constructor(
    private auth: JWTContent | Account,
    @InjectRepository(Account)
    private accounts: Repository<Account>,
  ) {}

  get id() {
    return this.auth.id;
  }
  get type() {
    return this.auth.type;
  }
  get jwt_version() {
    return this.auth instanceof Account
      ? this.auth.jwt_version
      : this.auth.version;
  }

  get jwt(): BaseJWTContent {
    if (this.auth instanceof Account) {
      return {
        id: this.auth.id,
        type: this.auth.type,
        version: this.auth.jwt_version ?? undefined,
      } satisfies BaseJWTContent;
    } else {
      return this.auth;
    }
  }

  async account(refresh = false): Promise<Account> {
    if (!refresh) {
      if (this.cached_account) {
        return this.cached_account;
      }

      if (this.auth instanceof Account) {
        return (this.cached_account = this.auth);
      }
    }

    return (this.cached_account = await this.accounts.findOneByOrFail({
      id: this.auth.id,
    }));
  }
}
