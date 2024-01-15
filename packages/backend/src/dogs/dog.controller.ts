import { Controller, Post, UseGuards, Body, Req, UseInterceptors, UploadedFile, Get, Param, Patch, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DogService } from './dog.service';

import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { AdminGuard } from 'src/auth/auth.admin';

import * as multer from 'multer';


@Controller('dogs')
export class DogController {
  constructor(private readonly dogService: DogService) { }


  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image', { storage: multer.memoryStorage() }))
  async create(@UploadedFile() file, @Body() createDogDto: CreateDogDto) {
    return await this.dogService.create(createDogDto, file);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.dogService.findOne(id);
  }

  @Get()
  async findAll() {
    return await this.dogService.findAll();
  }

  @Get('adults/:breed/:gender')
  async findByGenderAndBreed(@Param('breed') breed: string, @Param('gender') gender) {
    return await this.dogService.findByGenderAndBreed(gender, breed)
  }

  @Get('puppies/:breed')
  async findPuppiesByBreed(@Param('breed') breed: string) {
    console.log(breed);
    return await this.dogService.findPuppiesByBreed(breed);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: string, @Body() updateDogDto: UpdateDogDto) {
    return await this.dogService.update(id, updateDogDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: string) {
    await this.dogService.delete(id);
  }

  @Delete()
  @UseGuards(AdminGuard)
  async deleteSeveral(@Body('ids') ids: string[]) {
    await this.dogService.deleteSeveral(ids);
  }
}

