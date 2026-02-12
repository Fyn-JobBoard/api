import PermissionManager from 'src/common/utils/permissionManager';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Account, LinkedToAccount } from './account.entity';

@Entity('managed')
export class Managed extends LinkedToAccount {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 150,
  })
  name: string;

  @ManyToOne(() => Account, (account) => account.id, {
    nullable: true,
  })
  @JoinColumn({
    name: 'author_id',
  })
  author?: Account;

  @Column('bigint', {
    unsigned: true,
    default: '0',
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
