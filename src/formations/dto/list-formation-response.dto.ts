import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dto/listing/paginated.dto';
import { Formation } from '../entities/formation.entity';

@ApiSchema({
  description: "The return of the formation's list route",
})
export class ListFormationsResponseDto extends PaginatedDto {
  @ApiProperty({
    type: Formation,
    isArray: true,
  })
  list: Formation[];
}
