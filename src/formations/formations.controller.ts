import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
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
import { Student } from 'src/accounts/entities/student.entity';
import { Auth } from 'src/auth/class/auth.class';
import { AuthAccount } from 'src/auth/decorators/getters/account/account.decorator';
import { IsA } from 'src/auth/guards/is-logged/decorators/is-a/is-a.decorator';
import { IsManagedAnd } from 'src/auth/guards/is-logged/decorators/is-managed-and/is-managed-and.decorator';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { Permissions } from 'src/common/enums/permissions';
import { CreateFormationDto } from './dto/create-formation.dto';
import { ListFormationsResponseDto } from './dto/list-formation-response.dto';
import { UpdateFormationDto } from './dto/update-formation.dto';
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
    auth: Auth,
  ) {
    return this.createFor(formationDto, auth.id, auth);
  }

  @Post('/of/:student_id')
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
    auth: Auth,
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
    auth: Auth,

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

  @Get('/of/:student_id')
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

  @Get('/:formation_id')
  @ApiOperation({
    description: 'Get a single formation',
  })
  @ApiOkResponse({
    type: Formation,
  })
  @ApiParam({
    name: 'formation_id',
    description: 'The formation id you want to retreive',
    type: 'integer',
  })
  @Version('1')
  @UseGuards(IsLoggedGuard)
  @IsManagedAnd({
    permissions: (perms) => perms.hasAll(Permissions.VIEW_FORMATIONS),
  })
  public async single(
    @Param('formation_id', {
      transform: (v?: string) => parseInt(v ?? ''),
    })
    formation_id: number,
  ) {
    if (isNaN(formation_id)) {
      throw new BadRequestException('formation_id must be an integer');
    }

    const found = await this.formations.findOne(formation_id);
    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }

  @Put('/:formation_id')
  @UseGuards(IsLoggedGuard)
  @Version('1')
  @IsManagedAnd({
    permissions: (perms) => perms.hasAll(Permissions.MANAGE_FORMATIONS),
  })
  @ApiOperation({
    description: 'Modify an existing formation',
  })
  @ApiOkResponse({
    type: Formation,
  })
  async update(
    @Body()
    formationDto: UpdateFormationDto,
    @AuthAccount()
    auth: Auth,
    @Param('formation_id', {
      transform: (v?: string) => parseInt(v ?? ''),
    })
    formation_id: number,
  ) {
    if (isNaN(formation_id)) {
      throw new BadRequestException('formation_id must be a positive integer.');
    }

    const formation = await this.formations.findOne(formation_id);
    if (!formation) {
      throw new NotFoundException();
    }

    if (
      ![AccountTypes.Admin, AccountTypes.Managed].includes(auth.type) &&
      auth.id !== formation.student.id
    ) {
      throw new UnauthorizedException();
    }

    const result = await this.formations.update(formation.id, formationDto);
    if (result instanceof HttpException) {
      throw result;
    }

    return result;
  }
}
