import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDomainDto {
  @ApiProperty()
  name: string;
  @ApiProperty({ required: false })
  description?: string;
}
