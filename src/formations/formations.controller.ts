import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entities/account.entity';
import { Student } from 'src/accounts/entities/student.entity';
import { AuthAccount } from 'src/auth/decorators/getters/account/account.decorator';
import { IsA } from 'src/auth/guards/is-logged/decorators/is-a/is-a.decorator';
import { IsManagedAnd } from 'src/auth/guards/is-logged/decorators/is-managed-and/is-managed-and.decorator';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { Permissions } from 'src/common/enums/permissions';
import { CreateFormationDto } from './dto/create-formation.dto';
import { ListFormationsResponseDto } from './dto/list-formation-response.dto';
import { Formation } from './entities/formation.entity';
import { FormationsService } from './formations.service';

@Controller('formations')
@ApiBearerAuth()
@ApiBasicAuth()
@ApiResponse({
  status: '4XX',
  description: 'You must be logged to access this resources.',
})
export class FormationsController {
  constructor(
    private readonly formations: FormationsService,
    private readonly accounts: AccountsService,
  ) {}

  @Post('/')
  @UseGuards(IsLoggedGuard)
  @IsA([AccountTypes.Student])
  @Version('1')
  @ApiOperation({
    description:
      'Create a new formation and asign it to yourself (only available for students)',
  })
  @ApiOkResponse({
    type: Formation,
  })
  async create(
    @Body()
    formationDto: CreateFormationDto,
    @AuthAccount()
    auth: Account,
  ) {
    return this.createFor(formationDto, auth.id, auth);
  }

  @Post('/:student_id')
  @UseGuards(IsLoggedGuard)
  @Version('1')
  @IsManagedAnd({
    permissions: (perms) => perms.hasAll(Permissions.MANAGE_FORMATIONS),
  })
  @ApiParam({
    name: 'student_id',
    description:
      'The id of the student you want to asign the new formation to.',
  })
  @ApiOperation({
    description: 'Create a new formation',
  })
  @ApiOkResponse({
    type: Formation,
  })
  async createFor(
    @Body()
    formationDto: CreateFormationDto,
    @Param('student_id')
    student_id: string,
    @AuthAccount()
    auth: Account,
  ) {
    const student = await this.accounts.findModel(student_id, Student);
    if (!student) {
      throw new NotFoundException(`Student #${student_id} does not exists.`);
    }

    if (
      ![AccountTypes.Admin, AccountTypes.Managed].includes(auth.type) &&
      student.id !== auth.id
    ) {
      throw new UnauthorizedException();
    }

    return this.formations.create(formationDto, student);
  }

  @Get('/')
  @UseGuards(IsLoggedGuard)
  @IsA([AccountTypes.Student])
  @Version('1')
  @ApiOperation({
    description: 'Get all your formations (only available for students)',
  })
  @ApiOkResponse({
    type: ListFormationsResponseDto,
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
  async list(
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
  ) {
    return this.listFor(auth.id, page, per_page);
  }

  @Get('/:student_id')
  @UseGuards(IsLoggedGuard)
  @Version('1')
  @IsManagedAnd({
    permissions: (perms) => perms.hasAll(Permissions.VIEW_FORMATIONS),
  })
  @ApiParam({
    name: 'student_id',
    description: 'The id of the student you want to view the formations.',
  })
  @ApiOperation({
    description: 'View all formations of a student',
  })
  @ApiOkResponse({
    type: ListFormationsResponseDto,
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
  async listFor(
    @Param('student_id')
    student_id: string,

    @Query('page', {
      transform: (v?: string) => parseInt(v ?? ''),
    })
    page: number,
    @Query('per_page', {
      transform: (v?: string) => parseInt(v ?? ''),
    })
    per_page: number,
  ) {
    const student = await this.accounts.findModel(student_id, Student);
    if (!student) {
      throw new NotFoundException(`Student #${student_id} does not exists.`);
    }

    return this.formations.list(
      isNaN(page) ? undefined : Math.max(1, page),
      isNaN(per_page) ? 20 : Math.max(1, per_page),
      {
        student,
      },
    );
  }
}
