import {
    Controller,
    Post,
    UseGuards,
    Body,
    UseInterceptors,
    UploadedFile,
    Get,
    Param,
    Patch,
    Delete
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { PuppiesService } from './puppies.service';
  import { FindPuppiesDto } from './dto/find-puppies.dto';
  import { CreatePuppiesDto } from './dto/create-puppies.dto';
  import { UpdatePuppiesDto } from './dto/update-puppies.dto';
  import { AdminGuard } from 'src/auth/auth.admin';
  
  import * as multer from 'multer';
  
  @Controller('dogs')
  export class DogController {
    constructor(private readonly puppiesService: PuppiesService) {}
  
    @Post()
    @UseGuards(AdminGuard)
    @UseInterceptors(
      FileInterceptor('image', { storage: multer.memoryStorage() }),
    )
    async create(@UploadedFile() file, @Body() dto: CreatePuppiesDto) {
      return await this.puppiesService.create(dto, file);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return await this.puppiesService.findOne(id);
    }
  
    @Get()
    async findAll() {
      return await this.puppiesService.findAll();
    }
  
    @Post('find')
    async findBy(@Body() dto: FindPuppiesDto) {
      return await this.puppiesService.findByOptions(dto);
    }
  
    @Patch(':id')
    @UseGuards(AdminGuard)
    async update(@Param('id') id: string, @Body() dto: UpdatePuppiesDto) {
      return await this.puppiesService.update(id, dto);
    }
  
    @Delete(':id')
    @UseGuards(AdminGuard)
    async delete(@Param('id') id: string) {
      await this.puppiesService.delete(id);
    }
  
    @Delete()
    @UseGuards(AdminGuard)
    async deleteSeveral(@Body('ids') ids: string[]) {
      await this.puppiesService.deleteSeveral(ids);
    }
  }
  