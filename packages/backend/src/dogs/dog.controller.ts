import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { DogService } from './dog.service';
import { FindDogDto } from './dto/find-dog.dto';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { AdminGuard } from 'src/auth/auth.admin';

@Controller('dogs')
export class DogController {
  constructor(private readonly dogService: DogService) {}

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() dto: CreateDogDto) {
    return await this.dogService.create(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.dogService.findOne(id);
  }

  @Get()
  async findAll() {
    return await this.dogService.findAll();
  }

  @Post('find')
  async findBy(@Body() dto: FindDogDto) {
    return await this.dogService.findByOptions(dto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateDogDto) {
    return await this.dogService.update(id, dto);
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
