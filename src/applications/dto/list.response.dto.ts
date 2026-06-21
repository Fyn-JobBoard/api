import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dto/listing/paginated.dto';
import { Application } from '../entities/application.entity';

@ApiSchema({
  description: "The return of the application's list routes",
})
export class ListApplicationsResponseDto extends PaginatedDto {
  @ApiProperty({
    type: Application,
    isArray: true,
  })
  list: Application[];
}
