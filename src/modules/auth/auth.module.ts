import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PASSWORD_HASHER, USER_REPOSITORY } from '../../domain-contracts';
import { TOKEN_SERVICE } from './application/ports/token-service.port';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { UserTypeormRepository } from './infrastructure/persistence/user-typeorm.repository';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { BcryptPasswordHasher } from './infrastructure/services/bcrypt-password-hasher.service';
import { JwtTokenService } from './infrastructure/services/jwt-token.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { AuthController } from './interfaces/controllers/auth.controller';
import { ApiKeyGuard } from './interfaces/guards/api-key.guard';

function buildJwtOptions(configService: ConfigService): JwtModuleOptions {
  return {
    secret: configService.getOrThrow<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.getOrThrow<string>(
        'JWT_EXPIRES_IN',
      ) as NonNullable<JwtModuleOptions['signOptions']>['expiresIn'],
    },
  };
}

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: buildJwtOptions,
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    JwtStrategy,
    ApiKeyGuard,
    { provide: USER_REPOSITORY, useClass: UserTypeormRepository },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: TOKEN_SERVICE, useClass: JwtTokenService },
  ],
  // Other modules reuse the user repository and the API key guard.
  exports: [USER_REPOSITORY, PASSWORD_HASHER, ApiKeyGuard],
})
export class AuthModule {}
