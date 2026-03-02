import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  refs,
} from '@nestjs/swagger';
import type { Request as ReqType } from 'express';
import { IsA } from 'src/auth/guards/is-logged/decorators/is-a/is-a.decorator';
import { IsManagedAnd } from 'src/auth/guards/is-logged/decorators/is-managed-and/is-managed-and.decorator';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import { RequestAccountResolverMiddleware } from 'src/auth/middlewares/request-account-resolver/request-account-resolver.middleware';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { ManagedAccountPermissions } from 'src/common/enums/managedPermissions';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { ListAccountsResponseDto } from './dto/list-accounts.response.dto';
import { CreateManagedDto } from './dto/managed/create-managed.dto';
import { Account } from './entities/account.entity';
import { Administrator } from './entities/admin.entity';
import { Company } from './entities/company.entity';
import { Managed } from './entities/managed.entity';
import { Student } from './entities/student.entity';

@ApiResponse({
  status: '4XX',
  description:
    'You must be an admin or a managed account with the right acces to ping this route',
})
@ApiBearerAuth()
@ApiBasicAuth()
@ApiExtraModels(Student, Administrator, Company, Managed)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('/')
  @UseGuards(IsLoggedGuard)
  @IsA([AccountTypes.Admin, AccountTypes.Managed])
  @IsManagedAnd({
    permissions: (perm) => perm.hasAll(ManagedAccountPermissions.VIEW_ACCOUNTS),
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
  @ApiOkResponse({
    type: ListAccountsResponseDto,
  })
  @Version('1')
  public list(
    @Query('page', {
      transform: (v?: string) => parseInt(v ?? ''),
    })
    page: number,
    @Query('per_page', {
      transform: (v?: string) => parseInt(v ?? ''),
    })
    per_page: number,
  ) {
    return this.accountsService.list(
      isNaN(per_page) ? 20 : Math.max(1, per_page),
      isNaN(page) ? undefined : Math.max(1, page),
    );
  }

  @Get('/:id')
  @UseGuards(IsLoggedGuard)
  @IsA([AccountTypes.Admin, AccountTypes.Managed])
  @IsManagedAnd({
    permissions: (perm) => perm.hasAll(ManagedAccountPermissions.VIEW_ACCOUNTS),
  })
  @Version('1')
  @ApiOkResponse({
    type: Account,
  })
  @ApiParam({
    type: 'string',
    format: 'uuid',
    required: true,
    name: 'id',
  })
  public async get(
    @Param('id')
    id: string,
  ) {
    const account = await this.accountsService.find(id);
    if (!account) {
      throw new NotFoundException();
    }

    return account;
  }

  @Post('/')
  @UseGuards(IsLoggedGuard)
  @IsA([AccountTypes.Admin, AccountTypes.Managed])
  @IsManagedAnd({
    permissions: (perm) =>
      perm.hasAll(ManagedAccountPermissions.MANAGE_ACCOUNTS),
  })
  @Version('1')
  @ApiOkResponse({
    schema: {
      oneOf: refs(Student, Administrator, Company, Managed),
    },
  })
  @ApiBody({
    type: CreateAccountDto,
    description:
      "Note that you must provide exactly one of 'student', 'admin', 'company' or 'managed'.",
  })
  public async create(
    @Body()
    info: CreateAccountDto,

    @Request()
    req: ReqType,
  ) {
    const { admin, company, managed, student } = info;
    const defined = [admin, company, managed, student].filter((dto) => !!dto);
    if (defined.length !== 1) {
      throw new BadRequestException(
        'The account must define one of the admin, company, student or managed information.',
      );
    }

    if (defined[0] instanceof CreateManagedDto) {
      if (
        RequestAccountResolverMiddleware.getRequestAccount(req)?.type !==
          AccountTypes.Admin &&
        !defined[0].author_id
      ) {
        throw new UnauthorizedException(
          'System accounts can only be created by administrators.',
        );
      }
    }

    return await this.accountsService.create(info, defined[0]);
  }

  @Delete('/:id')
  @UseGuards(IsLoggedGuard)
  @IsA([AccountTypes.Admin, AccountTypes.Managed])
  @IsManagedAnd({
    permissions: (perm) =>
      perm.hasAll(ManagedAccountPermissions.MANAGE_ACCOUNTS),
  })
  @Version('1')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
  })
  @ApiOkResponse({
    type: Account,
    description: 'The deleted account',
  })
  public async delete(
    @Param('id')
    id: string,

    @Request()
    req: ReqType,
  ) {
    const account = await this.accountsService.find(id);
    if (!account) {
      throw new NotFoundException();
    }

    if (
      RequestAccountResolverMiddleware.getRequestAccount(req)?.type !==
      AccountTypes.Admin
    ) {
      const type = await this.accountsService.getModelOf(account);
      if (type instanceof Managed && !type.author) {
        throw new UnauthorizedException(
          'System accounts can only be deleted by administrators.',
        );
      }
    }

    await this.accountsService.delete(account);
    return account;
  }
}
