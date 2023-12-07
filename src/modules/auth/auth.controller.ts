import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from 'src/common/decorators';
import { IJwtPayload } from 'src/common/interfaces/auth.interface';
import { JwtAuthGuard, LocalAuthGuard } from 'src/middlewares/guards';
import { LoginDto } from './dto/auth.dto';
import { AuthService } from './services';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: LoginDto, @UserDecorator() user: IJwtPayload) {
    const { username } = body;
    return this.authService.login(username, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@UserDecorator() user: IJwtPayload) {
    const { userId } = user;
    return this.authService.logout(userId);
  }
}
