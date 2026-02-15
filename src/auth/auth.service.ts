import { Inject, Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AccountsService)
    private readonly accountService: AccountsService,
  ) {}
}
