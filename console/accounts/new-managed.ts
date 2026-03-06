import { input, select } from '@inquirer/prompts';
import { select as multiselect } from 'inquirer-select-pro';
import { AccountsService } from 'src/accounts/accounts.service';
import { CreateAccountDto } from 'src/accounts/dto/create-account.dto';
import { CreateManagedDto } from 'src/accounts/dto/managed/create-managed.dto';
import { Account } from 'src/accounts/entities/account.entity';
import appDatasource from 'src/app.datasource';
import { Permissions } from 'src/common/enums/permissions';
import { DataSource } from 'typeorm';

export async function create_managed_account(
  datasource: DataSource,
  accountDto = new CreateAccountDto(),
  managedDto = new CreateManagedDto(),
) {
  const repository = datasource.getRepository(Account);
  const accountService = new AccountsService(repository);

  accountDto.email ??= await input({
    message: 'Email address ?',
    required: true,
    pattern: /^[a-z][_\-a-z0-9.]*@[a-z][_\-a-z0-9.]*$/i,
    patternError: 'You must enter a valid email address.',
  });

  accountDto.password ??= await input({
    message: 'Password ?',
    required: true,
    pattern: /.{5,}/,
    patternError: 'The password must be at least 5 characters long.',
  });

  managedDto.name ??= await input({
    message: "Application's name ?",
    required: true,
  });

  managedDto.author_id ??= await select({
    message: "Account's author ?",
    choices: [
      { value: undefined, name: '[System]' },
      ...(await accountService.list().then((list) =>
        list.list.map((account) => ({
          value: account.id,
          name: account.email,
        })),
      )),
    ],
    default: undefined,
  });

  managedDto.permissions ??= await multiselect({
    message: "Application's permissions ?",
    options: Object.entries(Permissions)
      .filter(([, value]) => typeof value === 'number')
      .map(([name, value]) => ({
        name,
        value,
      })),
  }).then((arr) => arr.reduce((cur, pre: Permissions) => cur + pre, 0));

  return accountService.create(accountDto, managedDto);
}

if (process.argv[1] === __filename) {
  appDatasource
    .initialize()
    .then((ds) =>
      create_managed_account(ds).catch((e) =>
        console.error(
          e instanceof Error && e.name === 'ExitPromptError'
            ? 'Managed account creation cancelled.'
            : e,
        ),
      ),
    )
    .finally(() => appDatasource.destroy())

    .then(console.log)
    .catch(console.error);
}
