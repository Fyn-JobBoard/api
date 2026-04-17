import { SkillTypes } from 'src/common/enums/skillsTypes';
import { PGEnumToType } from './utils/enumTypeGen';

export class CreateSkillTypes1769028072945 extends PGEnumToType {
  constructor() {
    super({
      skill_type: SkillTypes,
    });
  }
}
