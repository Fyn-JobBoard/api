import { ActiveSearch } from 'src/active-searches/entities/active-search.entity';
import { Application } from 'src/applications/entities/application.entity';
import { Experience } from 'src/experiences/entities/experience.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { LinkedToAccount } from './account.entity';

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

  @OneToMany(() => Application, (application) => application.student, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  applications: Application[];

  @OneToMany(() => ActiveSearch, (search) => search.student, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  activeSearches: ActiveSearch[];

  @OneToMany(() => Experience, (experience) => experience.student, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  experiences: Experience[];
}
