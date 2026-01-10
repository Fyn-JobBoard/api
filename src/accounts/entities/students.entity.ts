import { Column, Entity, PrimaryColumn } from 'typeorm';
import { LinkedToAccount } from './accounts.entity';

@Entity('students')
export class Student extends LinkedToAccount {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', { length: 200 })
  first_name: string;
  @Column('varchar', { length: 200 })
  last_name: string;

  @Column('date')
  birthdate: Date;

  @Column('text', {
    default: "''",
  })
  bio: string;

  @Column('varchar', {
    array: true,
    length: 200,
  })
  links: string[];
}
