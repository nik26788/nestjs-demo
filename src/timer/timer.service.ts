/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron'; // 从 cron 包导入 CronJob 类

// Timer service, used for managing scheduled tasks.
@Injectable()
export class TimerService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  // Add a custom Cron scheduled task.
  addCronJob(name: string, cronExpression: string, callback: () => void) {
    const job = new CronJob(cronExpression, callback); // Use CronJob to create a scheduled task
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
    return `Scheduled task ${name} has started`;
  }

  // Stop the specified Cron scheduled task.
  stopCronJob(name: string) {
    try {
      const job = this.schedulerRegistry.getCronJob(name);
      job.stop();
      return 'Scheduled task has stopped';
    } catch (error) {
      return 'Scheduled task not found or already stopped';
    }
  }

  // Add a delayed task (Timeout).
  addTimeout(name: string, delay: number, callback: () => void) {
    const timeout = setTimeout(callback, delay);
    this.schedulerRegistry.addTimeout(name, timeout);
    return `Delayed task ${name} has started`;
  }

  // Stop the specified delayed task (Timeout).
  stopTimeout(name: string) {
    try {
      const timeout = this.schedulerRegistry.getTimeout(name);
      if (timeout) {
        clearTimeout(timeout);
        return `Delayed task ${name} has stopped`;
      } else {
        return `Delayed task ${name} does not exist`;
      }
    } catch (error) {
      return 'Delayed task not found or already stopped';
    }
  }

  // Add an interval task (Interval).
  addInterval(name: string, interval: number, callback: () => void) {
    const intervalId = setInterval(callback, interval);
    this.schedulerRegistry.addInterval(name, intervalId);
    return `Interval task ${name} has started`;
  }

  // Stop the specified interval task (Interval).
  stopInterval(name: string) {
    try {
      const intervalId = this.schedulerRegistry.getInterval(name);
      if (intervalId) {
        clearInterval(intervalId);
        return `Interval task ${name} has stopped`;
      } else {
        return `Interval task ${name} does not exist`;
      }
    } catch (error) {
      return 'Interval task not found or already stopped';
    }
  }
}
