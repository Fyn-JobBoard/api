import { AccountTypes } from 'src/common/enums/accountTypes';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

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
}

export abstract class LinkedToAccount {
  @OneToOne(() => Account, (account) => account.id)
  @JoinColumn({
    name: 'id',
  })
  account: Relation<Account>;
}
