import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { RedisService } from 'src/redis/redis.service';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthEntity } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupData: CreateAuthDto) {
    // console.log(signupData);
    const username = signupData.username;
    const findUser = await this.authRepository.findOne({
      where: { username },
    });
    if (findUser) {
      return 'user already exist';
    }
    const password = bcryptjs.hashSync(signupData.password, 10);
    await this.authRepository.save({ username, password });
    await this.redisService.set(username, password);
    return 'success signup';
  }

  async login(loginData: CreateAuthDto) {
    // console.log(loginData);
    const username = loginData.username;
    const findUser = await this.authRepository.findOne({
      where: { username },
    });
    // console.log(findUser)
    if (!findUser) {
      throw new BadRequestException('user not exist');
    }
    const compareRes = bcryptjs.compareSync(
      loginData.password,
      findUser.password,
    );
    if (!compareRes) {
      throw new BadRequestException('password error');
    }
    const payload = { username: findUser.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
