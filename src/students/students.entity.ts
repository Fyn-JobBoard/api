import { Account } from 'src/accounts/accounts.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('students')
export class Student {
  @PrimaryColumn({
    type: 'uuid',
  })
  id: string;

  @OneToOne(() => Account, (account) => account.id)
  @JoinColumn({
    name: 'id',
  })
  account: Account;

  @Column('varchar', { length: 200 })
  first_name: string;
  @Column('varchar', { length: 200 })
  last_name: string;

  @Column('date')
  birthdate: Date;

  @Column('text', {
    default: '',
  })
  bio: string;

  @Column('varchar', {
    array: true,
    length: 200,
  })
  links: string[];
}
