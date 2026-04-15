import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Company } from 'src/accounts/entities/company.entity';
import { Job } from 'src/jobs/entities/job.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

@Entity('activity_domains')
export class ActivityDomain {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    type: 'integer',
  })
  id: number;

  @Column('varchar', {
    unique: true,
    length: 60,
  })
  @ApiProperty({
    type: 'string',
    maxLength: 60,
  })
  name: string;

  @Column('varchar', {
    nullable: true,
    length: 500,
  })
  @ApiProperty({
    type: 'string',
    required: false,
    maxLength: 500,
  })
  description?: string;

  @OneToMany(() => Job, (job) => job.activity_domain, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Exclude()
  jobs: Relation<Job>[];

  @OneToMany(() => Company, (company) => company.activity_domain, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @Exclude()
  companies: Relation<Company>[];
}
