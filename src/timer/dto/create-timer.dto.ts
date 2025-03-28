import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTimerDto {
  @ApiProperty({ description: 'Timer name' })
  @IsNotEmpty({ message: 'Timer name is required' })
  name: string;
}
