import { CreateAccountDto } from 'src/accounts/dto/create-account.dto';
import { CreateManagedDto } from 'src/accounts/dto/managed/create-managed.dto';
import appDatasource from 'src/app.datasource';
import { Permissions } from 'src/common/enums/permissions';
import { DataSource } from 'typeorm';
import { create_managed_account } from './new-managed';

export async function create_root_managed_account(
  datasource: DataSource,
  accountDto = new CreateAccountDto(),
  managedDto = new CreateManagedDto(),
) {
  managedDto.permissions = Object.values(Permissions).reduce(
    (pre, cur) => pre + (typeof cur === 'number' ? cur : 0),
    0,
  );

  return create_managed_account(datasource, accountDto, managedDto);
}

if (process.argv[1] === __filename) {
  appDatasource
    .initialize()
    .then((ds) =>
      create_root_managed_account(ds).catch((e) =>
        console.error(
          e instanceof Error && e.name === 'ExitPromptError'
            ? 'Root managed account creation cancelled.'
            : e,
        ),
      ),
    )
    .finally(() => appDatasource.destroy())

    .then(console.log)
    .catch(console.error);
}
