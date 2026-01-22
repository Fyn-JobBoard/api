export default class PermissionManager {
  constructor(private base_permission: number = 0) {}

  static mask(...permissions: number[]): number {
    return permissions.reduce((mask, perm) => mask | perm, 0);
  }

  hasAll(...permissions: number[]): boolean {
    const mask = PermissionManager.mask(...permissions);
    return (mask & this.base_permission) === mask;
  }
  hasAny(...permissions: number[]): boolean {
    const mask = PermissionManager.mask(...permissions);
    return (mask | this.base_permission) !== 0;
  }
  hasNone(...permissions: number[]): boolean {
    return !this.hasAny(...permissions);
  }

  grant(...permissions: number[]): this {
    const mask = PermissionManager.mask(...permissions);
    this.base_permission |= mask;

    return this;
  }
  revoke(...permissions: number[]): this {
    const mask = PermissionManager.mask(...permissions);
    this.base_permission &= ~mask;

    return this;
  }
  toggle(...permissions: number[]): this {
    const mask = PermissionManager.mask(...permissions);
    this.base_permission ^= mask;

    return this;
  }

  get result() {
    return this.base_permission;
  }
}
