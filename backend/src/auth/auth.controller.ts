import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body() body: { email: string; password: string; role: 'CLIENT' | 'PRESTATAIRE' },
  ): Promise<User> {
    return this.authService.register(body.email, body.password, body.role);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }): Promise<{ access_token: string }> {
    return this.authService.login(body.email, body.password);
  }
}
