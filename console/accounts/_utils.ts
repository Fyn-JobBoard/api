import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entities/account.entity';
import { AuthService } from 'src/auth/auth.service';
import { DataSource } from 'typeorm';

export function accountRepository(datasource: DataSource) {
  return datasource.getRepository(Account);
}
export function accountService(datasource: DataSource) {
  const repository = accountRepository(datasource);

  return new AccountsService(
    repository,
    new AuthService(
      new JwtService({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: (process.env.JWT_TTL as StringValue | undefined) ?? '4d',
        },
      }),
      repository,
    ),
  );
}
