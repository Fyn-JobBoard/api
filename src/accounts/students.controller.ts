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
import type { Auth } from 'src/auth/class/auth.class';
import { AuthAccount } from 'src/auth/decorators/getters/account/account.decorator';
import { IsA } from 'src/auth/guards/is-logged/decorators/is-a/is-a.decorator';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { AccountsService } from './accounts.service';
import { ListStudentsResponseDto } from './dto/students/list-students.response.dto';
import { UpdateStudentDto } from './dto/students/update-student.dto';
import { Student } from './entities/student.entity';

@Controller('accounts/students')
@ApiBearerAuth()
@ApiBasicAuth()
@ApiResponse({
  status: '4XX',
  description: 'You must be logged to access to this resource.',
})
export class StudentsController {
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
    type: ListStudentsResponseDto,
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
      Student,
      isNaN(page) ? undefined : Math.max(1, page),
      isNaN(per_page) ? 20 : Math.max(1, per_page),
    );
  }

  @Get('/:id')
  @UseGuards(IsLoggedGuard)
  @Version('1')
  @ApiOkResponse({
    type: Student,
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
    const student = await this.accountsService.findModel(id, Student);
    if (!student) {
      throw new NotFoundException();
    }

    return student;
  }

  @Put('/:id')
  @UseGuards(IsLoggedGuard)
  @Version('1')
  @ApiOkResponse({
    type: Student,
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the student you want to modify',
  })
  @ApiOkResponse({
    type: Student,
  })
  @ApiBody({
    type: UpdateStudentDto,
  })
  public async update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateStudentDto,
  ) {
    const updated = await this.accountsService.update(
      id,
      Object.assign(new UpdateStudentDto(), dto),
    );
    if (updated instanceof HttpException) {
      throw updated;
    }

    return updated as Student;
  }

  @Put('/')
  @UseGuards(IsLoggedGuard)
  @IsA([AccountTypes.Student])
  @Version('1')
  @ApiOkResponse({
    type: Student,
  })
  @ApiOkResponse({
    type: Student,
  })
  @ApiBody({
    type: UpdateStudentDto,
  })
  @ApiOperation({
    description:
      'Update your own account. You must be logged as a student account.',
  })
  public async update_me(
    @Body()
    dto: UpdateStudentDto,

    @AuthAccount()
    auth: Auth,
  ) {
    return this.update(auth.id, dto);
  }
}
