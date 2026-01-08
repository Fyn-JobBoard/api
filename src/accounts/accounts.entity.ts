import { AccountTypes } from 'db/enums/accountTypes';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
