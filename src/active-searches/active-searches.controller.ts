import {
  Body,
  Controller,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
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
  ApiResponse,
} from '@nestjs/swagger';
import { AccountsService } from 'src/accounts/accounts.service';
import { Student } from 'src/accounts/entities/student.entity';
import { Auth } from 'src/auth/class/auth.class';
import { AuthAccount } from 'src/auth/decorators/getters/account/account.decorator';
import { IsA } from 'src/auth/guards/is-logged/decorators/is-a/is-a.decorator';
import { IsManagedAnd } from 'src/auth/guards/is-logged/decorators/is-managed-and/is-managed-and.decorator';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { Permissions } from 'src/common/enums/permissions';
import { ActiveSearchesService } from './active-searches.service';
import { SearchPredicates } from './dto/search-predicates.dto';
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
      !(
        search &&
        ([AccountTypes.Admin, AccountTypes.Managed].includes(auth.type) ||
          search.student.id === auth.id)
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
  @ApiBody({
    type: () => SearchPredicates,
  })
  @ApiOkResponse({
    type: () => ActiveSearch,
  })
  @ApiOperation({
    description: 'Update an existing search predicate',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
  })
  public async edit(
    @Param('id', {
      transform: (value: string) => parseInt(value),
    })
    id: number,

    @AuthAccount()
    auth: Auth,

    @Body()
    criterias: SearchPredicates,
  ) {
    const search = await this.searchesService.find(id);
    if (
      !(
        search &&
        ([AccountTypes.Admin, AccountTypes.Managed].includes(auth.type) ||
          search.student.id === auth.id)
      )
    ) {
      throw new NotFoundException();
    }

    const result = await this.searchesService.update(search, criterias);
    if (result instanceof HttpException) {
      throw result;
    }

    return result;
  }

  @Get('/of/:student_id')
  @IsManagedAnd({
    permissions: (perms) => perms.hasAll(Permissions.VIEW_ACTIVE_SEARCHES),
  })
  @Version('1')
  @ApiOkResponse({
    type: () => ActiveSearch,
    isArray: true,
  })
  @ApiParam({
    name: 'student_id',
    type: 'string',
    format: 'uuid',
    required: true,
  })
  @ApiOperation({
    description:
      'Get all the active search of a student. As a student, you can oonly access to yours',
  })
  public async allOfStudent(
    @Param('student_id')
    student_id: string,

    @AuthAccount()
    auth: Auth,
  ) {
    if (
      !(
        [AccountTypes.Admin, AccountTypes.Managed].includes(auth.type) ||
        student_id === auth.id
      )
    ) {
      throw new UnauthorizedException();
    }

    const student = await this.accounts.findModel(student_id, Student);
    if (!student) {
      throw new NotFoundException();
    }

    return this.searchesService.allOf(student);
  }

  @Post('/of/:student_id')
  @Version('1')
  @IsManagedAnd({
    permissions: (perms) => perms.hasAll(Permissions.MANAGE_ACTIVE_SEARCHES),
  })
  @ApiBody({
    type: () => SearchPredicates,
  })
  @ApiOperation({
    description: 'Register a new active search for the given student',
  })
  @ApiOkResponse({
    type: () => ActiveSearch,
  })
  @ApiParam({
    name: 'student_id',
    type: 'string',
    format: 'uuid',
    required: true,
  })
  public async create(
    @Param('student_id')
    student_id: string,

    @Body()
    criterias: SearchPredicates,

    @AuthAccount()
    auth: Auth,
  ) {
    if (
      !(
        [AccountTypes.Admin, AccountTypes.Managed].includes(auth.type) ||
        student_id === auth.id
      )
    ) {
      throw new UnauthorizedException();
    }

    const student = await this.accounts.findModel(student_id, Student);
    if (!student) {
      throw new NotFoundException();
    }

    const result = await this.searchesService.create(student, criterias);
    if (result instanceof HttpException) {
      throw result;
    }

    return result;
  }

  // For students only \\

  @Get('/me')
  @Version('1')
  @ApiOperation({
    description: 'As a student, get all my active search',
  })
  @IsA([AccountTypes.Student])
  @ApiOkResponse({
    type: () => ActiveSearch,
    isArray: true,
  })
  public async allOfMe(
    @AuthAccount()
    auth: Auth,
  ) {
    return this.allOfStudent(auth.id, auth);
  }

  @Post('/me')
  @Version('1')
  @ApiBody({
    type: () => SearchPredicates,
  })
  @IsA([AccountTypes.Student])
  @ApiOperation({
    description: 'As a student, register a new active search for me',
  })
  @ApiOkResponse({
    type: () => ActiveSearch,
  })
  public async createForMe(
    @Body()
    criterias: SearchPredicates,

    @AuthAccount()
    auth: Auth,
  ) {
    return this.create(auth.id, criterias, auth);
  }
}
