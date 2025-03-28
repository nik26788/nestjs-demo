import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'The title of the post' })
  @IsNotEmpty({ message: 'Title is required' })
  readonly title: string;

  @ApiProperty({ description: 'The author of the post' })
  @IsNotEmpty({ message: 'Author is required' })
  readonly author: string;

  @ApiPropertyOptional({ description: 'The content of the post' })
  readonly content: string;

  @ApiPropertyOptional({ description: 'The cover URL of the post' })
  readonly cover_url: string;
}
