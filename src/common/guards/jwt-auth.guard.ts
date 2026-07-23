import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    const request = context.switchToHttp().getRequest();
    
    // If it's a public route and there is NO token, just let them in.
    if (isPublic && !request.headers.authorization) {
      return true;
    }
    
    // Otherwise, we either need authentication (not public) OR we want to populate req.user
    // because they provided a token.
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const hasAuthHeader = !!request.headers.authorization;

    // If there is an auth header, they are TRYING to authenticate. If it fails, they should know.
    if (hasAuthHeader && (err || !user)) {
      throw err || new UnauthorizedException('Invalid or expired token. Please log in again.');
    }

    // If there's no auth header and the route is public, let them through
    if ((err || !user) && isPublic) {
      return null;
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    
    return user;
  }
}
