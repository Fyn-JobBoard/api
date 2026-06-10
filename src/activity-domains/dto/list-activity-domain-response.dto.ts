import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dto/listing/paginated.dto';
import { ActivityDomain } from '../entities/activity-domain.entity';

@ApiSchema({
  description: "The return of the activity domain's list route",
})
export class ListActivityDomainResponseDto extends PaginatedDto {
  @ApiProperty({
    type: ActivityDomain,
    isArray: true,
  })
  list: ActivityDomain[];
}
