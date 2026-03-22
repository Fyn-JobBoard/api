import { input } from '@inquirer/prompts';
import { OmitType } from '@nestjs/swagger';
import { validateSync } from 'class-validator';
import { AccountsService } from 'src/accounts/accounts.service';
import { CreateAdministratorDto } from 'src/accounts/dto/administrators/create-administrator.dto';
import { CreateAccountDto } from 'src/accounts/dto/create-account.dto';
import { Account } from 'src/accounts/entities/account.entity';
import appDatasource from 'src/app.datasource';
import { LoginDto } from 'src/auth/dto/login.dto';
import { DataSource } from 'typeorm';

export async function create_admin_account(
  datasource: DataSource,
  accountDto = new CreateAccountDto(),
  adminDto = new CreateAdministratorDto(),
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
    validate(password) {
      class PasswordSchema extends OmitType(LoginDto, ['email']) {}

      return (
        validateSync(Object.assign(new PasswordSchema(), { password }))
          .flatMap((e) => Object.values(e.constraints ?? {}))
          .join('\n') || true
      );
    },
  });

  adminDto.first_name ??= await input({
    message: "Admin's first name ?",
    required: true,
  });

  adminDto.last_name ??= await input({
    message: "Admin's last name ?",
    required: true,
  });

  return accountService.create(accountDto, adminDto);
}

if (process.argv[1] === __filename) {
  appDatasource
    .initialize()
    .then((ds) =>
      create_admin_account(ds).catch((e) =>
        console.error(
          e instanceof Error && e.name === 'ExitPromptError'
            ? 'Administrator account creation cancelled.'
            : e,
        ),
      ),
    )
    .finally(() => appDatasource.destroy())

    .then(console.log)
    .catch(console.error);
}
