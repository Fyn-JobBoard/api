import {
  Body,
  Controller,
  Get,
  HttpException,
  NotFoundException,
  NotImplementedException,
  Param,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthAccount } from 'src/auth/decorators/getters/account/account.decorator';
import { IsManagedAnd } from 'src/auth/guards/is-logged/decorators/is-managed-and/is-managed-and.decorator';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { ManagedAccountPermissions } from 'src/common/enums/managedPermissions';
import { Raw } from 'typeorm';
import { AccountsService } from './accounts.service';
import { ListManagedResponseDto } from './dto/managed/list-managed.response.dto';
import { UpdateManagedDto } from './dto/managed/update-managed.dto';
import { Account } from './entities/account.entity';
import { Managed } from './entities/managed.entity';

@Controller('managed')
@ApiBearerAuth()
@ApiBasicAuth()
@ApiResponse({
  status: '4XX',
  description:
    "You probably made a mistake in the request or you're not logged.",
})
@UseGuards(IsLoggedGuard)
export class ManagedController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('/')
  @Version('1')
  @IsManagedAnd({
    permissions: (perms) =>
      perms.hasAll(ManagedAccountPermissions.VIEW_MANAGED),
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'The page shift',
    type: 'integer',
    minimum: 1,
  })
  @ApiQuery({
    name: 'per_page',
    required: false,
    description: 'The amount of items you want in a page',
    type: 'integer',
    minimum: 1,
  })
  @ApiQuery({
    name: 'author_id',
    required: false,
    description:
      'Usable only by authorized accounts to retreive managed only for certain users',
    type: 'string',
    format: 'uuid',
    nullable: true,
  })
  @ApiOperation({
    description: 'List the managed accounts you own',
  })
  @ApiOkResponse({
    type: ListManagedResponseDto,
  })
  public async list(
    @AuthAccount()
    auth: Account,

    @Query('page', {
      transform: (v?: string) => parseInt(v ?? ''),
    })
    page: number,
    @Query('per_page', {
      transform: (v?: string) => parseInt(v ?? ''),
    })
    per_page: number,

    @Query('author_id')
    author_id?: string,
  ) {
    if (
      author_id &&
      !(
        author_id === auth.id ||
        [AccountTypes.Admin, AccountTypes.Managed].includes(auth.type)
      )
    ) {
      throw new UnauthorizedException(
        "You don't have the permission to list other account's manageds.",
      );
    }

    author_id ??= auth.id;

    return await this.accountsService.listOf(
      Managed,
      isNaN(page) ? undefined : page,
      isNaN(per_page) ? 20 : per_page,
      {
        author: {
          id: Raw((column) => `(${column})::text = :id`, { id: author_id }),
        },
      },
    );
  }

  @Get('/:id')
  @ApiQuery({
    name: 'id',
    type: 'string',
    format: 'uuid',
  })
  @Version('1')
  @IsManagedAnd({
    permissions: (perms) =>
      perms.hasAll(ManagedAccountPermissions.VIEW_MANAGED),
  })
  @ApiOkResponse({
    type: Managed,
  })
  public async get(
    @AuthAccount()
    auth: Account,

    @Query('id')
    id: string,
  ) {
    const found = await this.accountsService.findModel(id, Managed);
    if (
      !found ||
      (![AccountTypes.Admin, AccountTypes.Managed].includes(auth.type) &&
        found.author?.id === auth.id)
    ) {
      throw new NotFoundException();
    }

    return found;
  }

  @Put('/:id')
  @IsManagedAnd({
    permissions: (perms) =>
      perms.hasAll(ManagedAccountPermissions.MANAGE_MANAGED),
  })
  @Version('1')
  @ApiOkResponse({
    type: Managed,
  })
  @ApiBody({
    type: UpdateManagedDto,
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The id of the managed account you want to modify',
  })
  public async update(
    @Body()
    dto: UpdateManagedDto,

    @AuthAccount()
    auth: Account,

    @Param('id')
    id: string,
  ) {
    const found = await this.accountsService.findModel(id, Managed);
    if (!found) {
      throw new UnauthorizedException();
    }

    if (
      !(
        [AccountTypes.Admin, AccountTypes.Managed].includes(auth.type) ||
        found.author?.id !== auth.id
      )
    ) {
      throw new UnauthorizedException();
    }

    const deniedPermissionSetException = new UnauthorizedException(
      'Attempted to set permissions higher that authorized.',
    );

    switch (auth.type) {
      case AccountTypes.Managed: {
        const model: Managed = await this.accountsService.getModelOf(auth);
        throw new NotImplementedException();
        break;
      }

      case AccountTypes.Company:
      case AccountTypes.Student: {
        throw new NotImplementedException();
        break;
      }
    }

    const updated = this.accountsService.update(found.id, dto);
    if (updated instanceof HttpException) {
      throw updated;
    }

    return updated;
  }
}
