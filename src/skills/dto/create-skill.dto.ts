import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsString, MaxLength } from 'class-validator';
import { SkillTypes } from 'src/common/enums/skillsTypes';

export class CreateSkillDto {
  @IsDefined()
  @IsString()
  @MaxLength(60)
  @ApiProperty({
    type: 'string',
  })
  name: string;

  @IsEnum(SkillTypes)
  @IsDefined()
  @ApiProperty({
    enum: SkillTypes,
  })
  type: SkillTypes;
}
