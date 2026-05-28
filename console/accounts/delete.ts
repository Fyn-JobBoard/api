import { select } from '@inquirer/prompts';
import appDatasource from 'src/app.datasource';
import { DataSource } from 'typeorm';
import { accountService } from './_utils';

export async function delete_account(datasource: DataSource, id?: string) {
  const service = accountService(datasource);

  const choices = [
    ...(await service.list().then((list) =>
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

  return service.delete(id);
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
