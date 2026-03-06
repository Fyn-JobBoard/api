import { select } from '@inquirer/prompts';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entities/account.entity';
import appDatasource from 'src/app.datasource';
import { DataSource } from 'typeorm';

export async function delete_account(datasource: DataSource, id?: string) {
  const repository = datasource.getRepository(Account);
  const accountService = new AccountsService(repository);

  const choices = [
    ...(await accountService.list().then((list) =>
      list.list.map((account) => ({
        value: account.id,
        name: `${account.email} (${account.type})`,
      })),
    )),
  ];

  if (!choices.length) {
    console.error('No account to delete.');
    return;
  }

  id ??= await select({
    message: 'Account to delete ?',
    choices,
  });

  return accountService.delete(id);
}

if (process.argv[1] === __filename) {
  appDatasource
    .initialize()
    .then((ds) =>
      delete_account(ds).catch((e) =>
        console.error(
          e instanceof Error && e.name === 'ExitPromptError'
            ? 'Account deletion cancelled.'
            : e,
        ),
      ),
    )
    .finally(() => appDatasource.destroy())

    .then((e: any) => (e ? console.log(e) : null))
    .catch(console.error);
}
