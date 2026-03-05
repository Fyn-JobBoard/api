import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Student } from 'src/accounts/entities/student.entity';
import { PaginatedDto } from 'src/common/dto/listing/paginated.dto';

@ApiSchema({
  description: "The return of the account's list route",
})
export class ListStudentsResponseDto extends PaginatedDto {
  @ApiProperty({
    type: Student,
    isArray: true,
  })
  list: Student[];
}
