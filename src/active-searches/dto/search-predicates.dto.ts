import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class SearchPredicates {
  @ApiProperty({
    type: Date,
  })
  @IsOptional()
  @IsDateString()
  date: string;
}
