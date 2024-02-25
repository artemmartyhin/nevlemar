import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dog } from './dog.shema';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { FindDogDto } from './dto/find-dog.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class DogService {
  constructor(@InjectModel('Dog') private readonly dogModel: Model<Dog>) {}

  async findAll(): Promise<Dog[]> {
    return await this.dogModel.find().exec();
  }

  async findByOptions(findDogDto: FindDogDto): Promise<Dog[]> {
    return await this.dogModel.find(findDogDto).exec();
  }

  async findOne(id: string): Promise<Dog> {
    const dog = await this.dogModel.findById(id).exec();
    if (!dog) {
      throw new HttpException('Dog not found', HttpStatus.NOT_FOUND);
    }
    return dog;
  }

  async create(
    createDogDto: CreateDogDto,
    file: Express.Multer.File,
  ): Promise<Dog> {
    const newDog = new this.dogModel(createDogDto);

    if (file) {
      const uploadsDir = path.join(__dirname, '..', 'uploads');
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

  async update(id: string, updateDogDto: UpdateDogDto): Promise<Dog> {
    const updatedDog = await this.dogModel
      .findByIdAndUpdate(id, updateDogDto, { new: true })
      .exec();
    if (!updatedDog) {
      throw new HttpException('Dog not found', HttpStatus.NOT_FOUND);
    }
    return updatedDog;
  }

  async delete(id: string): Promise<void> {
    const result = await this.dogModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Dog not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteSeveral(ids: string[]): Promise<void> {
    const result = await this.dogModel.deleteMany({ _id: { $in: ids } }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Dogs not found', HttpStatus.NOT_FOUND);
    }
  }
}
