import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import {
  CreateBlogPostDto,
  UpdateBlogPostDto,
  CreateCategoryDto,
  CreateCommentDto,
} from './dto/create-blog-post.dto';
import { AdminGuard } from 'src/auth/auth.admin';

@Controller('blog')
export class BlogController {
  constructor(private readonly svc: BlogService) {}

  // IMPORTANT: static routes BEFORE :slug / :id to avoid conflicts

  @Get('categories')
  listCategories(@Query('locale') locale?: string) {
    return this.svc.listCategories(locale);
  }

  @Post('retranslate')
  @UseGuards(AdminGuard)
  retranslateAll() {
    return this.svc.retranslateAll();
  }

  @Post('categories')
  @UseGuards(AdminGuard)
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.svc.createCategory(dto);
  }

  @Delete('categories/:id')
  @UseGuards(AdminGuard)
  deleteCategory(@Param('id') id: string) {
    return this.svc.deleteCategory(id);
  }

  @Get('comments/:postSlug')
  listComments(@Param('postSlug') postSlug: string) {
    return this.svc.listComments(postSlug);
  }

  @Post('comments')
  createComment(@Body() dto: CreateCommentDto) {
    return this.svc.createComment(dto);
  }

  @Delete('comments/:id')
  @UseGuards(AdminGuard)
  deleteComment(@Param('id') id: string) {
    return this.svc.deleteComment(id);
  }

  @Post('comments/:id/like')
  likeComment(@Param('id') id: string) {
    return this.svc.likeComment(id);
  }

  @Post(':slug/like')
  like(@Param('slug') slug: string) {
    return this.svc.like(slug);
  }

  @Get('related/:slug')
  related(@Param('slug') slug: string, @Query('locale') locale?: string) {
    return this.svc.related(slug, 3, locale);
  }

  @Get()
  findAll(@Query() q: any) {
    return this.svc.findAll(q);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() dto: CreateBlogPostDto) {
    return this.svc.create(dto);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() dto: UpdateBlogPostDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  delete(@Param('id') id: string) {
    return this.svc.delete(id);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string, @Query('locale') locale?: string) {
    return this.svc.findBySlug(slug, locale);
  }
}
