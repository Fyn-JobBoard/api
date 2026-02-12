import { Application } from 'src/applications/entities/application.entity';
import { ActiveSearch } from 'src/active-searches/entities/active-search.entity';
import { Experience } from 'src/experiences/entities/experience.entity';
import { Formation } from 'src/formations/entities/formation.entity';
import { StudentSkill } from 'src/skills/entities/student-skill.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
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

  @OneToMany(() => Application, application => application.student)
  applications: Application[];
}
