import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entities/account.entity';
import { Student } from 'src/accounts/entities/student.entity';
import { AuthAccount } from 'src/auth/decorators/getters/account/account.decorator';
import { IsManagedAnd } from 'src/auth/guards/is-logged/decorators/is-managed-and/is-managed-and.decorator';
import { IsLoggedGuard } from 'src/auth/guards/is-logged/is-logged.guard';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { Permissions } from 'src/common/enums/permissions';
import { CreateFormationDto } from './dto/create-formation.dto';
import { FormationsService } from './formations.service';

@Controller('formations')
export class FormationsController {
  constructor(
    private readonly formations: FormationsService,
    private readonly accounts: AccountsService,
  ) {}

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
  async create(
    @Body() formationDto: CreateFormationDto,
    @Param('student_id') student_id: string,
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
}
