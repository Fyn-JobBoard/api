import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  Version,
} from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    description: 'Login to the application by retreiving your JWT token.',
  })
  @ApiBody({
    type: LoginDto,
  })
  @Version('1')
  public async login(
    @Body()
    loginDto: LoginDto,
  ) {
    const account = await this.authService.loginIn(
      loginDto.email,
      loginDto.password,
    );
    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      jwt: account.jwt,
      account,
    };
  }
}
