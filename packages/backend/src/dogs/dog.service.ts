import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dog } from './dog.schema';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { FindDogDto } from './dto/find-dog.dto';

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
    if (!dog) throw new HttpException('Dog not found', HttpStatus.NOT_FOUND);
    return dog;
  }

  async create(dto: CreateDogDto): Promise<Dog> {
    const { imageUrl, ...rest } = dto as any;
    const newDog = new this.dog(rest);
    if (!newDog.images) newDog.images = [];
    if (imageUrl) newDog.images[0] = imageUrl;
    return await newDog.save();
  }

  async update(id: string, dto: UpdateDogDto): Promise<Dog> {
    const dog = await this.dog.findById(id).exec();
    if (!dog) throw new HttpException('Dog not found', HttpStatus.NOT_FOUND);

    const { imageUrl, ...rest } = dto as any;
    Object.keys(rest).forEach((k) => {
      if (rest[k] !== undefined) (dog as any)[k] = rest[k];
    });
    if (imageUrl !== undefined) {
      if (!dog.images) dog.images = [];
      dog.images[0] = imageUrl;
      dog.markModified('images');
    }
    return await dog.save();
  }

  async delete(id: string): Promise<void> {
    const result = await this.dog.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new HttpException('Dog not found', HttpStatus.NOT_FOUND);
  }

  async deleteSeveral(ids: string[]): Promise<void> {
    const result = await this.dog.deleteMany({ _id: { $in: ids } }).exec();
    if (result.deletedCount === 0) throw new HttpException('Dogs not found', HttpStatus.NOT_FOUND);
  }
}
