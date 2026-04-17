import { AccountTypes } from 'src/common/enums/accountTypes';

export interface RequestUser {
  id: string;
  accountType: AccountTypes;
}
