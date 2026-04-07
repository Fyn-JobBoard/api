import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWTContent } from 'src/auth/types/jwt-content';

export const AuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JWTContent => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
