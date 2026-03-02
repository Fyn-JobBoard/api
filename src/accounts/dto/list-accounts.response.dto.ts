import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Account } from '../entities/account.entity';

@ApiSchema({
  description: "The return of the account's list route",
})
export class ListAccountsResponseDto {
  @ApiProperty({
    minimum: 1,
    type: 'integer',
  })
  page: number;

  @ApiProperty({
    type: 'integer',
    minimum: 1,
  })
  pages: number;

  @ApiProperty({
    type: Account,
    isArray: true,
  })
  list: Account[];
}
