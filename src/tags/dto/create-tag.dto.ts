import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, MaxLength } from 'class-validator';
export class CreateTagDto {
  @IsDefined()
  @IsString()
  @MaxLength(60)
  @ApiProperty({
    type: 'string',
    maxLength: 60,
  })
  name!: string;
}
