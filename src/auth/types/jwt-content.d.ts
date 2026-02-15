import type { AccountTypes } from 'src/common/enums/accountTypes';

export interface JWTContent {
  id: string;
  type: AccountTypes;
  version: number;
}
