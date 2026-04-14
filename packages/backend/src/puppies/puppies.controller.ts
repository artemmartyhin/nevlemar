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
import { PuppiesService } from './puppies.service';
import { FindPuppiesDto } from './dto/find-puppies.dto';
import { CreatePuppiesDto } from './dto/create-puppies.dto';
import { UpdatePuppiesDto } from './dto/update-puppies.dto';
import { AdminGuard } from 'src/auth/auth.admin';

@Controller('puppies')
export class PuppiesController {
  constructor(private readonly puppiesService: PuppiesService) {}

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() dto: CreatePuppiesDto) {
    return await this.puppiesService.create(dto);
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
