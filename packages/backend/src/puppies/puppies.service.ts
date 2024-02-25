import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Puppies } from './puppies.schema';

import { CreatePuppiesDto } from './dto/create-puppies.dto';
import { UpdatePuppiesDto } from './dto/update-puppies.dto';
import { FindPuppiesDto } from './dto/find-puppies.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class PuppiesService {
  constructor(@InjectModel('Dog') private readonly puppies: Model<Puppies>) {}

  async findAll(): Promise<Puppies[]> {
    return await this.puppies.find().exec();
  }

  async findByOptions(dto: FindPuppiesDto): Promise<Puppies[]> {
    return await this.puppies.find(dto).exec();
  }

  async findOne(id: string): Promise<Puppies> {
    const dog = await this.puppies.findById(id).exec();
    if (!dog) {
      throw new HttpException('Dog not found', HttpStatus.NOT_FOUND);
    }
    return dog;
  }

  async create(
    dto: CreatePuppiesDto,
    file: Express.Multer.File,
  ): Promise<Puppies> {
    const newDog = new this.puppies(dto);

    if (file) {
      const uploadsDir = '/data/uploads'
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const hash = crypto.createHash('sha256');
      hash.update(`${Date.now()}-${Math.random()}`);
      const hashedFilename = hash.digest('hex').substring(0, 16);
      const fileExtension = path.extname(file.originalname);
      const uniqueFilename = `${hashedFilename}${fileExtension}`;

      const filePath = path.join(uploadsDir, uniqueFilename);
      fs.writeFileSync(filePath, file.buffer);

      newDog.image = uniqueFilename;
    }
    return await newDog.save();
  }

  async update(id: string, dto: UpdatePuppiesDto): Promise<Puppies> {
    const updatedDog = await this.puppies
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updatedDog) {
      throw new HttpException('Dog not found', HttpStatus.NOT_FOUND);
    }
    return updatedDog;
  }

  async delete(id: string): Promise<void> {
    const result = await this.puppies.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Dog not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteSeveral(ids: string[]): Promise<void> {
    const result = await this.puppies.deleteMany({ _id: { $in: ids } }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Dogs not found', HttpStatus.NOT_FOUND);
    }
  }
}
