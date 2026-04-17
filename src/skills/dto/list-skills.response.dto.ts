import { ApiProperty } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dto/listing/paginated.dto';
import { Skill } from '../entities/skill.entity';

export class ListSkillsDto extends PaginatedDto {
  @ApiProperty({
    type: () => Skill,
    isArray: true,
  })
  list: Skill[];
}
