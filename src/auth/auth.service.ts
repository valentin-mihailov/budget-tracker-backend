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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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

    delete existingUser.password;
    return existingUser;
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
