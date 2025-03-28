/* eslint-disable @typescript-eslint/no-misused-promises */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsEntity } from './entities/post.entity';

export interface PostsRo {
  list: PostsEntity[];
  count: number;
  totalPages: number;
  currentPage: number;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
  ) {}
  async create(post: Partial<PostsEntity>): Promise<PostsEntity> {
    const { title } = post;
    if (!title) {
      throw new HttpException('title is required', 401);
    }
    const doc = await this.postsRepository.findOne({ where: { title } });
    if (doc) {
      throw new HttpException('doc is exist', 401);
    }
    return await this.postsRepository.save(post);
  }

  async findAll(
    query: Partial<PostsEntity & { page: number; pageSize: number }>,
  ): Promise<PostsRo> {
    const { page = 1, pageSize = 10 } = query;
    const [posts, totalCount] = await this.postsRepository.findAndCount({
      skip: (page - 1) * pageSize, // 分页偏移量
      take: pageSize, // 每页显示的记录数
      order: { create_time: 'DESC' },
    });

    return {
      list: posts,
      count: totalCount,
      totalPages: Math.ceil(totalCount / pageSize), // 计算总页数
      currentPage: page, // 当前页
    };
  }

  async findById(id: number): Promise<PostsEntity | null> {
    return await this.postsRepository.findOne({ where: { id } });
  }

  async updateById(id: number, post: UpdatePostDto): Promise<PostsEntity> {
    const existPost = await this.postsRepository.findOne({ where: { id } });
    if (!existPost) {
      throw new HttpException(`The doc of id ${id} is not exist`, 401);
    }
    const updatePost = this.postsRepository.merge(existPost, post);
    return this.postsRepository.save(updatePost);
  }

  remove(id: number) {
    const existPost = this.postsRepository.findOne({ where: { id } });
    if (!existPost) {
      throw new HttpException('post is not exist', 401);
    }
    return this.postsRepository.delete(id);
  }
}
