import { Formation } from 'src/formations/entities/formation.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity('activity_domains')
export class ActivityDomain {

@PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {
    unique: true,
    length: 60,})
    name: string;

    @Column('varchar', {
    nullable: true,
    length: 500,})
    description?: string;

    @OneToMany(
    () => Job,
    job => job.activity_domain
  )
    jobs: Job[];
  
}
