import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiErrors,
  ApiSuccess,
} from '../../../../shared/swagger/api-responses.decorator';
import { LoginResult } from '../../application/dtos/login-result.dto';
import { LoginUserDto } from '../../application/dtos/login-user.dto';
import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import { UserProfile } from '../../application/dtos/user-profile.dto';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { Public } from '../decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
  ) {}

  @ApiOperation({
    summary: 'Register a user',
    description:
      'Public endpoint. Creates an ADMIN or MECHANIC account; `specialty` is required for mechanics. The password is stored hashed and never returned.',
  })
  @ApiSuccess(UserProfile, {
    status: HttpStatus.CREATED,
    description: 'User created.',
  })
  @ApiErrors({
    badRequest:
      'Invalid payload (e.g. weak password, missing specialty for a mechanic).',
    conflict: 'A user with this email already exists.',
  })
  @Public()
  @Post('register')
  register(@Body() dto: RegisterUserDto): Promise<UserProfile> {
    return this.registerUser.execute(dto);
  }

  @ApiOperation({
    summary: 'Log in',
    description:
      'Public endpoint. Returns a JWT access token. Use the **Authorize** button above and paste the token to call protected endpoints.',
  })
  @ApiSuccess(LoginResult, { description: 'Authenticated; token issued.' })
  @ApiErrors({
    badRequest: 'Invalid payload.',
    unauthorized: 'Wrong email or password, or the account is inactive.',
  })
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginUserDto): Promise<LoginResult> {
    return this.loginUser.execute(dto);
  }
}
