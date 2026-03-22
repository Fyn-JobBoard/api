export enum Permissions {
  VIEW_ACCOUNTS = 1 << 0,
  MANAGE_ACCOUNTS = 1 << 1,

  MANAGE_STUDENTS = 1 << 2,

  VIEW_MANAGED = 1 << 3,
  MANAGE_MANAGED = 1 << 4,

  VIEW_FORMATIONS = 1 << 5,
  MANAGE_FORMATIONS = 1 << 6,
}
