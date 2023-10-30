import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dog } from './dog.model';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';

@Injectable()
export class DogService {
  constructor(@InjectModel('Dog') private readonly dogModel: Model<Dog>) {}

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

  async create(createDogDto: CreateDogDto): Promise<Dog> {
    const newDog = new this.dogModel(createDogDto);
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
}
