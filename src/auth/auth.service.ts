import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto, RegisterDto } from 'src/dto/auth.dto';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async loginUser(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (!existingUser) {
      throw new UnauthorizedException(`A user with this email doesn't exist!`);
    }

    const passwordsMatch: boolean = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!passwordsMatch) {
      throw new UnauthorizedException(`Passwords don't match!`);
    }

    const payload = { sub: existingUser.id, email: existingUser.email };

    delete existingUser.password;
    return {
      access_token: this.jwtService.sign(payload),
      user: existingUser,
    };
  }

  async registerUser(registerDto: RegisterDto) {
    const { email, password } = registerDto;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('This email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);
    return { message: 'Registration successful!' };
  }
}
