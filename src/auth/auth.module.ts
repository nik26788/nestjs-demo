import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';
import { jwtConstants } from '../common/constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthEntity } from './entities/auth.entity';
import JwtAuthStrategy from './jwt-auth.strategy';
@Module({
  imports: [
    TypeOrmModule.forFeature([AuthEntity]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthStrategy],
})
export class AuthModule {}
