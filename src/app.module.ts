/* eslint-disable @typescript-eslint/require-await */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthEntity } from './auth/entities/auth.entity';
import { jwtAuthGuard } from './auth/jwt-auth.grard';
import { LoggerService } from './logger/logger.service';
import { PostsEntity } from './posts/entities/post.entity';
import { PostsModule } from './posts/posts.module';
import { TimerModule } from './timer/timer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        entities: [PostsEntity, AuthEntity], // 数据表实体
        host: configService.get('DB_HOST'), // 主机，默认为localhost
        port: configService.get<number>('DB_PORT'), // 端口号
        username: configService.get('DB_USER'), // 用户名
        password: configService.get('DB_PASSWORD'), // 密码
        database: configService.get('DB_DATABASE'), //数据库名
        timezone: '+08:00', //服务器上配置的时区
        synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
      }),
    }),
    PostsModule,
    AuthModule,
    TimerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: jwtAuthGuard,
    },
    LoggerService,
  ],
})
export class AppModule {}
