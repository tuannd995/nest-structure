import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { User as UserEntity } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @User() user: UserEntity) {
    const accessToken = await this.authService.login(user);
    return {
      message: 'Login successfully',
      error: false,
      accessToken: accessToken,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getUser(@User() user: UserEntity) {
    return {
      message: 'Get profile successfully',
      user,
    };
  }
}
