import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto {
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
}
