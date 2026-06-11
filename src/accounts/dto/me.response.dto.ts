import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Account } from '../entities/account.entity';
import { Administrator } from '../entities/admin.entity';
import { Company } from '../entities/company.entity';
import { Managed } from '../entities/managed.entity';
import { Student } from '../entities/student.entity';

@ApiSchema()
export class MeRouteAsStudentResponse extends Student {
  @ApiProperty({
    type: Account,
  })
  declare account: Account;
}

@ApiSchema()
export class MeRouteAsCompanyResponse extends Company {
  @ApiProperty({
    type: Account,
  })
  declare account: Account;
}

@ApiSchema()
export class MeRouteAsAdministratorResponse extends Administrator {
  @ApiProperty({
    type: Account,
  })
  declare account: Account;
}

@ApiSchema()
export class MeRouteAsManagedResponse extends Managed {
  @ApiProperty({
    type: Account,
  })
  declare account: Account;
}

export type MeRouteResponse =
  | MeRouteAsCompanyResponse
  | MeRouteAsManagedResponse
  | MeRouteAsStudentResponse
  | MeRouteAsAdministratorResponse;
