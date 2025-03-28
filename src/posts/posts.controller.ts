import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRo, PostsService } from './posts.service';

@ApiTags('post')
@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Create a post' })
  @Post('/create')
  async create(@Body() post: CreatePostDto) {
    return await this.postsService.create(post);
  }

  @ApiOperation({ summary: 'Find all posts based on query parameters' })
  @Get('/findAll')
  async findAll(@Query() query): Promise<PostsRo> {
    return await this.postsService.findAll(query);
  }

  @ApiOperation({ summary: 'Find a post by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findById(+id);
  }

  @ApiOperation({ summary: 'Update a post by ID' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updateById(+id, updatePostDto);
  }

  @ApiOperation({ summary: 'Delete a post by ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
