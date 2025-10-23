import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

interface LoginDto {
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { password } = loginDto;
    
    if (!this.authService.validatePassword(password)) {
      throw new UnauthorizedException('Invalid password');
    }
    
    const token = this.authService.generateToken();
    
    return {
      success: true,
      token,
      message: 'Login successful'
    };
  }

  @Post('verify')
  async verify(@Body() body: { token: string }) {
    const isValid = this.authService.validateToken(body.token);
    
    return {
      valid: isValid,
      message: isValid ? 'Token is valid' : 'Token is invalid'
    };
  }
}
