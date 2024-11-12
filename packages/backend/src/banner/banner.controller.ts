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
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { AdminGuard } from 'src/auth/auth.admin';
import { BannerService } from './banner.service';
import * as multer from 'multer';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('image', { storage: multer.memoryStorage() }),
  )
  async update(@UploadedFile() file, @Body() dto: UpdateBannerDto) {
    return await this.bannerService.update(dto, file);
  }

  @Get()
  async getBanner() {
    return await this.bannerService.getBanner();
  }

}
