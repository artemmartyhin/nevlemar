import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dog } from './dog.schema';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { FindDogDto } from './dto/find-dog.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class DogService {
  constructor(@InjectModel('Dog') private readonly dog: Model<Dog>) {}

  async findAll(): Promise<Dog[]> {
    return await this.dog.find().exec();
  }

  async findByOptions(dto: FindDogDto): Promise<Dog[]> {
    return await this.dog.find(dto).exec();
  }

  async findOne(id: string): Promise<Dog> {
    const dog = await this.dog.findById(id).exec();
    if (!dog) {
      throw new HttpException('Dog not found', HttpStatus.NOT_FOUND);
    }
    return dog;
  }

  async create(
    dto: CreateDogDto,
    file: Express.Multer.File,
  ): Promise<Dog> {
    const newDog = new this.dog(dto);

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

      newDog.images[0] = uniqueFilename;
    }

    return await newDog.save();
  }

  async update(id: string, dto: UpdateDogDto): Promise<Dog> {
    const updatedDog = await this.dog
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updatedDog) {
      throw new HttpException('Dog not found', HttpStatus.NOT_FOUND);
    }
    return updatedDog;
  }

  async delete(id: string): Promise<void> {
    const result = await this.dog.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Dog not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteSeveral(ids: string[]): Promise<void> {
    const result = await this.dog.deleteMany({ _id: { $in: ids } }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Dogs not found', HttpStatus.NOT_FOUND);
    }
  }
}
