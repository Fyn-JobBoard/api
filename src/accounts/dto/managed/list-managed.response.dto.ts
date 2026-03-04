import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Managed } from 'src/accounts/entities/managed.entity';
import { PaginatedDto } from 'src/common/dto/listing/paginated.dto';

@ApiSchema({
  description: "The return of the account's list route",
})
export class ListManagedResponseDto extends PaginatedDto {
  @ApiProperty({
    type: Managed,
    isArray: true,
  })
  list: Managed[];
}
