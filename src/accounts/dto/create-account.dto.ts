import { IsDefined, IsEmail, IsStrongPassword } from 'class-validator';

export class CreateAccountDto {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsStrongPassword({
    minLength: 6,
    minSymbols: 1,
    minNumbers: 1,
  })
  password: string;
}
