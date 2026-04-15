import {
  Controller,
  Get,
  NotFoundException,
  NotImplementedException,
  Param,
  Put,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AccountsService } from 'src/accounts/accounts.service';
import { Auth } from 'src/auth/class/auth.class';
import { AuthAccount } from 'src/auth/decorators/getters/account/account.decorator';
import { IsManagedAnd } from 'src/auth/guards/is-logged/decorators/is-managed-and/is-managed-and.decorator';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { Permissions } from 'src/common/enums/permissions';
import { ActiveSearchesService } from './active-searches.service';
import { ActiveSearch } from './entities/active-search.entity';

@Controller('searches')
@UseGuards(IsLoggedGuard)
@ApiBearerAuth()
@ApiBasicAuth()
@ApiResponse({
  status: '4XX',
  description: 'You must be logged to access to this resource.',
})
export class ActiveSearchesController {
  constructor(
    private readonly searchesService: ActiveSearchesService,
    private readonly accounts: AccountsService,
  ) {}

  @Get('/:id')
  @Version('1')
  @IsManagedAnd({
    permissions: (perms) => perms.hasAll(Permissions.VIEW_ACTIVE_SEARCHES),
  })
  @ApiParam({
    name: 'id',
    description: 'id the of the active search',
  })
  @ApiOkResponse({
    type: () => ActiveSearch,
  })
  @ApiOperation({
    description: 'Get a specific active search',
  })
  public async find(
    @Param('id', {
      transform: (value: string) => parseInt(value),
    })
    id: number,

    @AuthAccount()
    auth: Auth,
  ) {
    const search = await this.searchesService.find(id);
    if (
      !search ||
      !(
        [AccountTypes.Admin, AccountTypes.Managed].includes(auth.type) ||
        search.student.id === auth.id
      )
    ) {
      throw new NotFoundException();
    }

    return search;
  }

  @Put('/:id')
  @Version('1')
  @IsManagedAnd({
    permissions: (perms) => perms.hasAll(Permissions.MANAGE_ACTIVE_SEARCHES),
  })
  public async edit(
    @Param('id', {
      transform: (value: string) => parseInt(value),
    })
    id: number,

    @AuthAccount()
    auth: Auth,
  ) {
    const search = await this.searchesService.find(id);
    if (
      !search ||
      !(
        [AccountTypes.Admin, AccountTypes.Managed].includes(auth.type) ||
        search.student.id === auth.id
      )
    ) {
      throw new NotFoundException();
    }

    throw new NotImplementedException();
  }
}
