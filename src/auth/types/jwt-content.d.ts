import type { AccountTypes } from 'src/common/enums/accountTypes';

export interface BaseJWTContent {
  id: string;
  type: AccountTypes;
  version?: number;
}

export interface JWTContent extends BaseJWTContent {
  version: number;
}
