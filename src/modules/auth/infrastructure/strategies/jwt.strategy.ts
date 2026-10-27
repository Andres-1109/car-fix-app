import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { USER_REPOSITORY } from '../../../../domain-contracts';
import type {
  AuthenticatedUser,
  IUserRepository,
} from '../../../../domain-contracts';
import { TokenPayload } from '../../application/ports/token-service.port';

/**
 * Validates the bearer token signature and expiration, then re-checks the user
 * in the database so deactivated or deleted accounts lose access immediately,
 * even while their token is still valid. The returned object becomes `request.user`.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayload): Promise<AuthenticatedUser> {
    const user = await this.userRepository.findById(payload.sub);
    if (!user?.isActive) {
      throw new UnauthorizedException('User is no longer active');
    }
    return { id: user.id, email: user.email, role: user.role };
  }
}
