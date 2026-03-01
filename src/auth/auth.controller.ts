import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  Version,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';

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
  @ApiResponse({
    status: '4XX',
    description: 'High chances that you provided invalid credentials',
  })
  @ApiOkResponse({
    type: LoginResponseDto,
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
