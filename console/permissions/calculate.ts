import { select } from 'inquirer-select-pro';
import { Permissions } from 'src/common/enums/permissions';

export async function calculate_permissions() {
  const choices = await select({
    message: 'Permissions :',
    multiple: true,
    options: Object.entries(Permissions)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, perm]) => typeof perm === 'number')
      .map(([name, value]: [string, Permissions]) => ({
        name,
        value,
      })),
  });

  const permission = choices.reduce((pre, cur) => pre + cur, 0);
  console.log(
    `Calculated permission: ${permission} (0b${permission.toString(2)}).`,
  );
}

if (process.argv[1] === __filename) {
  calculate_permissions().catch(console.error);
}
