import {
  Body,
  Controller,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Put,
  Query,
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
import { IsA } from 'src/auth/guards/is-logged/decorators/is-a/is-a.decorator';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { AccountsService } from './accounts.service';
import { ListCompaniesResponseDto } from './dto/companies/list-companies.response.dto';
import { UpdateCompanyDto } from './dto/companies/update-company.dto';
import { Account } from './entities/account.entity';
import { Company } from './entities/company.entity';

@Controller('accounts/companies')
@ApiBearerAuth()
@ApiBasicAuth()
@ApiResponse({
  status: '4XX',
  description:
    'Surely a credential (you must be logged to use those endpoints) or input issues.',
})
export class CompaniesController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('/')
  @UseGuards(IsLoggedGuard)
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
    type: ListCompaniesResponseDto,
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
    return this.accountsService.listOf(
      Company,
      isNaN(page) ? undefined : Math.max(1, page),
      isNaN(per_page) ? 20 : Math.max(1, per_page),
    );
  }

  @Get('/:id')
  @UseGuards(IsLoggedGuard)
  @Version('1')
  @ApiOkResponse({
    type: Company,
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
    const company = await this.accountsService.findModel(id, Company);
    if (!company) {
      throw new NotFoundException();
    }

    return company;
  }

  @Put('/:id')
  @UseGuards(IsLoggedGuard)
  @Version('1')
  @ApiOkResponse({
    type: Company,
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the student you want to modify',
  })
  @ApiOkResponse({
    type: Company,
  })
  @ApiBody({
    type: UpdateCompanyDto,
  })
  public async update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateCompanyDto,
  ) {
    const updated = await this.accountsService.update(id, dto);
    if (updated instanceof HttpException) {
      throw updated;
    }

    return updated as Company;
  }

  @Put('/')
  @UseGuards(IsLoggedGuard)
  @IsA([AccountTypes.Company])
  @Version('1')
  @ApiOkResponse({
    type: Company,
  })
  @ApiOkResponse({
    type: Company,
  })
  @ApiBody({
    type: UpdateCompanyDto,
  })
  @ApiOperation({
    description:
      'Update your own account. You must be logged as a student account.',
  })
  public async update_me(
    @Body()
    dto: UpdateCompanyDto,

    @AuthAccount()
    auth: Account,
  ) {
    return this.update(auth.id, dto);
  }
}
