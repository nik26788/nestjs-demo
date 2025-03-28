import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private redisClient: Redis;

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    this.redisClient = new Redis({
      host: configService.get<string>('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
      password: configService.get<string>('REDIS_PASSWORD'),
    });
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string, expire?: number): Promise<string> {
    if (expire) {
      return await this.redisClient.set(key, value, 'EX', expire);
    } else {
      return await this.redisClient.set(key, value);
    }
  }

  async del(key: string): Promise<number> {
    return await this.redisClient.del(key);
  }

  onModuleDestroy() {
    this.redisClient.disconnect();
  }
}
