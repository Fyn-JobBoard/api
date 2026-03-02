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
} from '@nestjs/common';
import type { Request as ReqType } from 'express';
import { IsA } from 'src/auth/guards/is-logged/decorators/is-a/is-a.decorator';
import { IsManagedAnd } from 'src/auth/guards/is-logged/decorators/is-managed-and/is-managed-and.decorator';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import { RequestAccountResolverMiddleware } from 'src/auth/middlewares/request-account-resolver/request-account-resolver.middleware';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { ManagedAccountPermissions } from 'src/common/enums/managedPermissions';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateManagedDto } from './dto/managed/create-managed.dto';
import { Managed } from './entities/managed.entity';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('/')
  @UseGuards(IsLoggedGuard)
  @IsA([AccountTypes.Admin, AccountTypes.Managed])
  @IsManagedAnd({
    permissions: (perm) => perm.hasAll(ManagedAccountPermissions.VIEW_ACCOUNTS),
  })
  public list(
    @Query('page')
    page?: string,
    @Query('amount')
    amount?: string,
  ) {
    const page_shift = parseInt(page ?? '');
    const per_page = parseInt(amount ?? '');

    return this.accountsService.list(
      isNaN(per_page) ? 20 : per_page,
      isNaN(page_shift) ? undefined : page_shift,
    );
  }

  @Get('/:id')
  @UseGuards(IsLoggedGuard)
  @IsA([AccountTypes.Admin, AccountTypes.Managed])
  @IsManagedAnd({
    permissions: (perm) => perm.hasAll(ManagedAccountPermissions.VIEW_ACCOUNTS),
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
