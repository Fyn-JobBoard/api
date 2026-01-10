export enum PGRoles {
  Student = 'student',
  Administrator = 'admin',
  Managed = 'managed',
  Company = 'company',
}

export function PGRolesPassword(role: PGRoles): string | undefined {
  return process.env[`${role.toString().toUpperCase()}_ROLE_PASSWORD`];
}
