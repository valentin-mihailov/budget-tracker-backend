import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from 'src/dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(`login`)
  async login(@Body() loginDto: LoginDto) {
    console.log(loginDto);
    return this.authService.loginUser(loginDto);
  }

  @Post(`register`)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }
}
