import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dto/listing/paginated.dto';
import { Experience } from '../entities/experience.entity';

@ApiSchema({
  description: "The return of the experience's list route",
})
export class ListExperiencesResponseDto extends PaginatedDto {
  @ApiProperty({
    type: Experience,
    isArray: true,
  })
  list: Experience[];
}
