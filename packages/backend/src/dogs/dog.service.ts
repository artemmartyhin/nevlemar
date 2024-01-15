import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dog } from './dog.model';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class DogService {
  constructor(@InjectModel('Dog') private readonly dogModel: Model<Dog>) { }

  async findAll(): Promise<Dog[]> {
    return await this.dogModel.find().exec();
  }

  async findOne(id: string): Promise<Dog> {
    const dog = await this.dogModel.findById(id).exec();
    if (!dog) {
      throw new NotFoundException('Dog not found');
    }
    return dog;
  }

  async findByGenderAndBreed(
    gender: string,
    breed: string,
  ): Promise<Dog[]> {
    return await this.dogModel.find({
      breed: breed,
      gender: gender
    }).exec();
  }

  async findPuppiesByBreed(breed: string): Promise<Dog[]> {
    console.log(breed);
    return await this.dogModel.find({
      breed: breed,
      isPuppy: true
    }).exec();
  }

  async create(createDogDto: CreateDogDto, file: Express.Multer.File): Promise<Dog> {
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

      newDog.image = uniqueFilename;
    }

    return await newDog.save();
  }

  async update(id: string, updateDogDto: UpdateDogDto): Promise<Dog> {
    const updatedDog = await this.dogModel
      .findByIdAndUpdate(id, updateDogDto, { new: true })
      .exec();
    if (!updatedDog) {
      throw new NotFoundException('Dog not found');
    }
    return updatedDog;
  }

  async delete(id: string): Promise<void> {
    const result = await this.dogModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Dog not found');
    }
  }

  async deleteSeveral(ids: string[]): Promise<void> {
    const result = await this.dogModel.deleteMany({ _id: { $in: ids } }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Dogs not found');
    }
  }
}
