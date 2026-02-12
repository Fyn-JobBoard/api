import { Column, Entity, PrimaryColumn } from 'typeorm';
import { LinkedToAccount } from './account.entity';

@Entity('admins')
export class Administrator extends LinkedToAccount {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 200,
  })
  first_name: string;
  @Column('varchar', {
    length: 200,
  })
  last_name: string;
}
