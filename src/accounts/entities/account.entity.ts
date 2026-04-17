import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AccountTypes } from 'src/common/enums/accountTypes';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import type { Administrator } from './admin.entity';
import type { Company } from './company.entity';
import type { Managed } from './managed.entity';
import type { Student } from './student.entity';

export type AccountModel =
  | typeof Student
  | typeof Managed
  | typeof Company
  | typeof Administrator;

@Entity('accounts')
@ApiSchema()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @Column('varchar', {
    unique: true,
    length: 200,
  })
  @ApiProperty({
    type: 'string',
    format: 'email',
    maxLength: 200,
  })
  email: string;

  @Column('varchar', {
    length: 200,
  })
  @Exclude()
  password: string;

  @Column('integer', {
    nullable: true,
  })
  @Exclude()
  jwt_version: number | null;

  @Column('enum', {
    enum: AccountTypes,
  })
  @ApiProperty({
    enum: AccountTypes,
  })
  type: AccountTypes;
}

export abstract class LinkedToAccount {
  @OneToOne(() => Account, (account) => account.id, {
    eager: true,
  })
  @JoinColumn({
    name: 'id',
  })
  account: Relation<Account>;
}
