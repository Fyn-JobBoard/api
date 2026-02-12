import { IsDefined, IsEnum, IsString, MaxLength } from 'class-validator';
import { SkillTypes } from 'src/common/enums/skillsTypess';

export class CreateSkillDto {
  @IsDefined()
  @IsString()
  @MaxLength(60)
  name: string;

  @IsEnum(SkillTypes)
  @IsDefined()
  type: SkillTypes;
}
