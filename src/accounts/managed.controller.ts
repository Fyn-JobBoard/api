import {
  Body,
  Controller,
  Get,
  HttpException,
  NotFoundException,
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
import assert from 'node:assert';
import type { Auth } from 'src/auth/class/auth.class';
import { AuthAccount } from 'src/auth/decorators/getters/account/account.decorator';
import { IsManagedAnd } from 'src/auth/guards/is-logged/decorators/is-managed-and/is-managed-and.decorator';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { Permissions } from 'src/common/enums/permissions';
import PermissionManager, {
  COMPANIES_PERMISSIONS,
  STUDENTS_PERMISSIONS,
} from 'src/common/utils/permissionManager';
import { FindOptionsWhere, ILike, IsNull, Raw } from 'typeorm';
import { AccountsService } from './accounts.service';
import { ListManagedResponseDto } from './dto/managed/list-managed.response.dto';
import { UpdateManagedDto } from './dto/managed/update-managed.dto';
import { Managed } from './entities/managed.entity';

@Controller('accounts/managed')
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
    permissions: (perms) => perms.hasAll(Permissions.VIEW_MANAGED),
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
      'Usable only by authorized accounts to retreive managed only for certain users. Use "system" to show only system managed accounts.',
    type: 'string',
    format: 'uuid|"system"',
  })
  @ApiQuery({
    name: 'search',
    description: "Search for managed's names or email",
    required: false,
    type: 'string',
  })
  @ApiOperation({
    description: 'List the managed accounts you own',
  })
  @ApiOkResponse({
    type: ListManagedResponseDto,
  })
  public async list(
    @AuthAccount()
    auth: Auth,

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

    @Query('search')
    search?: string,
  ) {
    if (![AccountTypes.Admin, AccountTypes.Managed].includes(auth.type)) {
      if (author_id && author_id !== auth.id) {
        throw new UnauthorizedException(
          "You don't have the permission to list other account's manageds.",
        );
      } else {
        author_id = auth.id;
      }
    }

    const base_where: FindOptionsWhere<Managed> = {};
    if (author_id) {
      base_where['author'] =
        author_id === 'system'
          ? IsNull()
          : {
              id: Raw((column) => `(${column})::text = :id`, { id: author_id }),
            };
    }

    return await this.accountsService.listOf(
      Managed,
      isNaN(page) ? undefined : page,
      isNaN(per_page) ? 20 : per_page,
      search
        ? [
            { ...base_where, name: ILike(`%${search}%`) },
            { ...base_where, account: { email: ILike(`%${search}%`) } },
          ]
        : base_where,
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
    permissions: (perms) => perms.hasAll(Permissions.VIEW_MANAGED),
  })
  @ApiOkResponse({
    type: Managed,
  })
  public async get(
    @AuthAccount()
    auth: Auth,

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
    permissions: (perms) => perms.hasAll(Permissions.MANAGE_MANAGED),
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
    auth: Auth,

    @Param('id')
    id: string,
  ) {
    const found = await this.accountsService.findModel(id, Managed);
    if (!found) {
      throw new NotFoundException();
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
        const model = await this.accountsService.getModelOf(
          await auth.account(),
        );
        assert(model instanceof Managed);

        if (!model.checkPermissions().hasAll(dto.permissions ?? 0)) {
          throw deniedPermissionSetException;
        }

        break;
      }

      case AccountTypes.Company: {
        if (
          !new PermissionManager(dto.permissions ?? 0).hasAll(
            COMPANIES_PERMISSIONS,
          )
        ) {
          throw deniedPermissionSetException;
        }

        break;
      }

      case AccountTypes.Student: {
        if (
          !new PermissionManager(dto.permissions ?? 0).hasAll(
            STUDENTS_PERMISSIONS,
          )
        ) {
          throw deniedPermissionSetException;
        }

        break;
      }
    }

    const updated = await this.accountsService.update(
      found.id,
      Object.assign(new UpdateManagedDto(), dto),
    );
    if (updated instanceof HttpException) {
      throw updated;
    }

    return updated;
  }
}
