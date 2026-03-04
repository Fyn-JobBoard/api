import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Company } from 'src/accounts/entities/company.entity';
import { PaginatedDto } from 'src/common/dto/listing/paginated.dto';

@ApiSchema({
  description: "The return of the account's list route",
})
export class ListCompaniesResponseDto extends PaginatedDto {
  @ApiProperty({
    type: Company,
    isArray: true,
  })
  list: Company[];
}
