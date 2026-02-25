import { Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/dto/auth.dto';

@Injectable()
export class AuthService {
  async loginUser(loginDto: LoginDto) {
    return loginDto;
  }

  async registerUser(registerDto: RegisterDto) {
    return registerDto;
  }
}
