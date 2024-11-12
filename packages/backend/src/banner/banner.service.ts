import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner } from './banner.schema';
import { UpdateBannerDto } from './dto/update-banner.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BannerService {
  constructor(@InjectModel('Banner') private readonly bannerModel: Model<Banner>) {}

  async update(
    dto: UpdateBannerDto,
    file: Express.Multer.File
  ): Promise<Banner> {
    let banner = await this.bannerModel.findOne({});

    if (!banner) {
      banner = new this.bannerModel({
        topic: dto.topic,
        description: dto.description,
        url: dto.url,
        image: "",
      });
    } else {
      banner.topic = dto.topic;
      banner.description = dto.description;
      banner.url = dto.url;
    }

    const uploadsDir = '/data/uploads/';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const fileExtension = path.extname(file.originalname);
    const uniqueFilename = `banner${fileExtension}`;
    const filePath = path.join(uploadsDir, uniqueFilename);
    if (banner.image && fs.existsSync(path.join(uploadsDir, banner.image))) {
      fs.unlinkSync(path.join(uploadsDir, banner.image));
    }

    fs.writeFileSync(filePath, file.buffer);
    banner.image = uniqueFilename;
    await banner.save();

    return banner;
  }

  async getBanner(): Promise<Banner> {
    return await this.bannerModel.findOne({});
  }
}
