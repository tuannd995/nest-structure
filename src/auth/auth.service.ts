import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { User } from 'src/user/entities/user.entity';
import { UserService } from '../user/user.service';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne({ username });

    if (user.status === 0) {
      throw new BadRequestException('User is not active');
    }

    if (user && (await compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;

      return rest;
    }

    return null;
  }

  async login(user: User): Promise<string> {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload);
  }

  async getUserInfo(accessToken: string): Promise<string> {
    const jwt = this.jwtService.verifyAsync(accessToken);
    return jwt;
  }
}
