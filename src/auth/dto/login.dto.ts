import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsStrongPassword } from 'class-validator';
import { Account } from 'src/accounts/entities/account.entity';

@ApiSchema()
export class LoginDto {
  @IsDefined()
  @IsEmail()
  @ApiProperty({
    type: 'string',
    format: 'email',
    required: true,
  })
  email: string;

  @IsDefined()
  @IsStrongPassword({
    minLength: 6,
    minSymbols: 1,
    minNumbers: 1,
  })
  @ApiProperty({
    required: true,
    type: 'string',
    format: 'password',
  })
  password: string;
}

@ApiSchema()
export class LoginResponseDto {
  @ApiProperty({
    type: 'string',
    format: 'jwt',
    description: "Your account's jwt",
  })
  jwt: string;

  @ApiProperty({
    description: "Your account's info",
  })
  account: Account;
}
