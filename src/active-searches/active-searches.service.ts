import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountsService } from 'src/accounts/accounts.service';
import { Repository } from 'typeorm';
import { ActiveSearch } from './entities/active-search.entity';

@Injectable()
export class ActiveSearchesService {
  constructor(
    @InjectRepository(ActiveSearch)
    private readonly searches: Repository<ActiveSearch>,
    private readonly accounts: AccountsService,
  ) {}

  public async find(id: number) {
    return this.searches.findOneBy({ id });
  }
}
