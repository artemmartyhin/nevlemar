import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DogService } from './dog.service';
import { FindDogDto } from './dto/find-dog.dto';

import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { AdminGuard } from 'src/auth/auth.admin';

import * as multer from 'multer';

@Controller('dogs')
export class DogController {
  constructor(private readonly dogService: DogService) {}

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('image', { storage: multer.memoryStorage() }),
  )
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
  async findBy(@Param('breed') breed: string, @Param('gender') gender) {
    const options = new FindDogDto();
    options.breed = breed;
    options.gender = gender;
    return await this.dogService.findByOptions(options);
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
