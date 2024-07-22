import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: any): Promise<User> {
    // Hash the password before saving
    if (registerDto.password) {
      registerDto.password = await bcrypt.hash(registerDto.password, 10);
    }

    // Check if the email already exists
    const existingUser = await this.userService.findOneByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    return this.userService.create(registerDto);
  }

  async login(loginDto: { email: string; password: string }): Promise<{ access_token: string; user: User }> {
    const { email, password } = loginDto;
    const user = await this.userService.findOneByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    return { user,access_token };
  }
}
