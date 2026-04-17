import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { LinkedToAccount } from './account.entity';

@Entity('admins')
@ApiSchema()
export class Administrator extends LinkedToAccount {
  @PrimaryColumn('uuid')
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @Column('varchar', {
    length: 200,
  })
  @ApiProperty({
    type: 'string',
    maxLength: 200,
  })
  first_name: string;

  @Column('varchar', {
    length: 200,
  })
  @ApiProperty({
    type: 'string',
    maxLength: 200,
  })
  last_name: string;
}
