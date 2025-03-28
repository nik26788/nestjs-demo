import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/public.decorator';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  async signup(@Body() signupData: CreateAuthDto) {
    return await this.authService.signup(signupData);
  }

  @Public()
  @Post('/login')
  async login(@Body() loginData: CreateAuthDto) {
    return await this.authService.login(loginData);
  }
}
