import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { DogService } from './dog.service';

import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';


@Controller('dogs')
export class DogController {
  constructor(private readonly dogService: DogService) { }

  @Post()
  async create(@Body() createDogDto: CreateDogDto) {
    return await this.dogService.create(createDogDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.dogService.findOne(id);
  }

  @Get()
  async findAll() {
    return await this.dogService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDogDto: UpdateDogDto) {
    return await this.dogService.update(id, updateDogDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.dogService.delete(id);
  }
}

