import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Permissions } from 'src/common/enums/permissions';
import PermissionManager from 'src/common/utils/permissionManager';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from 'typeorm';
import { Account, LinkedToAccount } from './account.entity';

@Entity('managed')
@ApiSchema()
export class Managed extends LinkedToAccount {
  @PrimaryColumn('uuid')
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @Column('varchar', {
    length: 150,
  })
  @ApiProperty({
    type: 'string',
  })
  name: string;

  @ManyToOne(() => Account, (account) => account.id, {
    nullable: true,
  })
  @JoinColumn({
    name: 'author_id',
  })
  @ApiProperty({
    type: () => Account,
    required: false,
    description:
      'The author of the account. If this value is `null`, then this is a system managed account.',
  })
  author?: Relation<Account>;

  @Column('bigint', {
    unsigned: true,
    default: '0',
  })
  @ApiProperty({
    type: 'integer',
    minimum: 0,
    maximum: new PermissionManager().grant(
      ...Object.values(Permissions).filter((p) => typeof p === 'number'),
    ).result,
  })
  permissions: number;

  private get permissionManager() {
    return new PermissionManager(this.permissions);
  }
  editPermissions(editor: (manager: PermissionManager) => unknown): this {
    const manager = this.permissionManager;
    editor(manager);
    this.permissions = manager.result;

    return this;
  }
  checkPermissions(): PermissionManager {
    return this.permissionManager;
  }
}
