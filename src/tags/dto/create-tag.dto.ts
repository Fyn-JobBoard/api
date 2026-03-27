import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, MaxLength } from 'class-validator';
export class CreateTagDto {
  @IsDefined()
  @IsString()
  @MaxLength(50)
  @ApiProperty({
    type: 'string',
    maxLength: 50,
  })
  name: string;
}
