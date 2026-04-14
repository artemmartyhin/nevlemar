import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogSeedService } from './blog.seed';
import {
  BlogPostSchema,
  BlogCategorySchema,
  BlogCommentSchema,
} from './blog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'BlogPost', schema: BlogPostSchema },
      { name: 'BlogCategory', schema: BlogCategorySchema },
      { name: 'BlogComment', schema: BlogCommentSchema },
    ]),
  ],
  providers: [BlogService, BlogSeedService],
  controllers: [BlogController],
})
export class BlogModule {}
