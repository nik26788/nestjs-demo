import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/public.decorator';
import { CreateTimerDto } from './dto/create-timer.dto';
import { TimerService } from './timer.service';

@ApiTags('Timer')
@Controller('timer')
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  /**
   * 尝试定时任务
   * @param post
   */
  @Public()
  @ApiOperation({ summary: 'Start a Cron timer' })
  @Post('/start-timer')
  create(@Body() post: CreateTimerDto) {
    return this.timerService.addCronJob(post.name, '*/5 * * * * *', () => {
      console.log(
        'The scheduled task has been started and is executed every five seconds',
      );
    });
  }

  /**
   * 手动停止 Cron 定时任务
   * @param post
   */
  @Public()
  @ApiOperation({ summary: 'Manually stop the Cron scheduled task' })
  @Get('/stop-timer/:name')
  stopTimer(@Param('name') name: string) {
    return this.timerService.stopCronJob(name);
  }
}
