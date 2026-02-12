import { AccountTypes } from 'src/common/enums/accountTypes';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Company } from './company.entity';
import { Managed } from './managed.entity';
import { Student } from './student.entity';

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
  fetch_type(): Student | Managed | Company | null {
    return null;
  }
}

export abstract class LinkedToAccount {
  @OneToOne(() => Account, (account) => account.id)
  @JoinColumn({
    name: 'id',
  })
  account: Relation<Account>;
}
