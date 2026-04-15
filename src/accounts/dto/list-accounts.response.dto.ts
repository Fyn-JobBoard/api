import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dto/listing/paginated.dto';
import { Account } from '../entities/account.entity';

@ApiSchema({
  description: "The return of the account's list route",
})
export class ListAccountsResponseDto extends PaginatedDto {
  @ApiProperty({
    type: Account,
    isArray: true,
  })
  list: Account[];
}
