import { AccountTypes } from 'src/common/enums/accountTypes';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Managed } from './managed.entity';
import { Student } from './students.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    unique: true,
    length: 200,
  })
  email: string;

  @Column('varchar', {
    length: 200,
  })
  password: string;

  @Column('enum', {
    enum: AccountTypes,
  })
  type: AccountTypes;

  /**
   * Retreive the associed account type
   */
  fetch_type(): Student | Managed | null {
    return null;
  }
}

export abstract class LinkedToAccount {
  @OneToOne(() => Account, (account) => account.id)
  @JoinColumn({
    name: 'id',
  })
  account: Account;
}
