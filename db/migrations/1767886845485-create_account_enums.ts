import { AccountStatus } from 'src/common/enums/accountStatus';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { PGEnumToType } from './utils/enumTypeGen';

export class CreateAccountEnums1767886845485 extends PGEnumToType {
  constructor() {
    super({
      account_status: AccountStatus,
      account_type: AccountTypes,
    });
  }
}
