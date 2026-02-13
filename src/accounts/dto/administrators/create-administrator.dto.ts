import { IsDefined, MaxLength } from 'class-validator';

export class CreateAdministratorDto {
  @IsDefined()
  @MaxLength(200)
  first_name: string;

  @IsDefined()
  @MaxLength(200)
  last_name: string;
}
