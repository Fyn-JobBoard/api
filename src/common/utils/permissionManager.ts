export default class PermissionManager {
  constructor(private base_permission: number = 0) {}

  static mask(...permissions: number[]): number {
    return permissions.reduce((mask, perm) => mask | perm, 0);
  }

  /**
   * Returns `true` if the current permissions contains all the given ones
   */
  hasAll(...permissions: number[]): boolean {
    const mask = PermissionManager.mask(...permissions);
    return (mask & this.base_permission) === mask;
  }
  /**
   * Returns `true` if the current permissions contains at least one of the given ones
   */
  hasAny(...permissions: number[]): boolean {
    const mask = PermissionManager.mask(...permissions);
    return (mask | this.base_permission) !== 0;
  }
  /**
   * Returns `true` if the current permissions does not contains any of the given ones
   */
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

export const STUDENTS_PERMISSIONS = new PermissionManager().grant().result;
export const COMPANIES_PERMISSIONS = new PermissionManager().grant().result;
