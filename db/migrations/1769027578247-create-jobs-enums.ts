import { ContractTypes } from 'src/common/enums/contractTypes';
import { Languages } from 'src/common/enums/languages';
import { RemunerationPeriods } from 'src/common/enums/remunerationPeriods';
import { WorkingModes } from 'src/common/enums/workingModes';
import { PGEnumToType } from './utils/enumTypeGen';

export class CreateJobsEnums1769027578247 extends PGEnumToType {
  constructor() {
    super({
      language: Languages,
      work_mode: WorkingModes,
      remuneration_period: RemunerationPeriods,
      work_contract: ContractTypes,
    });
  }
}
