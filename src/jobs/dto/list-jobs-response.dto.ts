import { ApiProperty } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dto/listing/paginated.dto';
import { Job } from '../entities/job.entity';

export class ListJobsResponse extends PaginatedDto {
  @ApiProperty({
    type: () => Job,
    isArray: true,
  })
  list: Job[];
}
