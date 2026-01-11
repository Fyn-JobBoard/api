import { Column, Entity, PrimaryColumn } from 'typeorm';
import { LinkedToAccount } from './accounts.entity';

@Entity('companies')
export class Company extends LinkedToAccount {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 250,
  })
  name: string;

  @Column('text', {
    default: "''",
  })
  bio: string;

  @Column('date')
  creation_date: Date;

  @Column('varchar', {
    length: 500,
    nullable: true,
  })
  scrapped_from: string;

  @Column('varchar', {
    length: 200,
    nullable: true,
  })
  website_url: string;
}
