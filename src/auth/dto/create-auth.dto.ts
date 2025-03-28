import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'securepassword123',
  })
  @IsNotEmpty()
  readonly password: string;
}
