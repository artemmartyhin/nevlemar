import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Puppies } from './puppies.schema';
import { CreatePuppiesDto } from './dto/create-puppies.dto';
import { UpdatePuppiesDto } from './dto/update-puppies.dto';
import { FindPuppiesDto } from './dto/find-puppies.dto';

@Injectable()
export class PuppiesService {
  constructor(@InjectModel('Puppies') private readonly puppiesModel: Model<Puppies>) {}

  async findAll(): Promise<Puppies[]> {
    return await this.puppiesModel.find().exec();
  }

  async findByOptions(dto: FindPuppiesDto): Promise<Puppies[]> {
    return await this.puppiesModel.find(dto).exec();
  }

  async findOne(id: string): Promise<Puppies> {
    const puppies = await this.puppiesModel.findById(id).exec();
    if (!puppies) throw new HttpException('Puppies not found', HttpStatus.NOT_FOUND);
    return puppies;
  }

  async create(dto: CreatePuppiesDto): Promise<Puppies> {
    const newPuppies = new this.puppiesModel({
      mom: dto.mom,
      dad: dto.dad,
      breed: dto.breed,
      description: dto.description,
      metaTitle: dto.metaTitle,
      metaDescription: dto.metaDescription,
      image: dto.imageUrl || '',
      puppies: (dto.puppies || []).map((p: any) => ({
        name: p.name,
        born: p.born,
        gender: p.gender,
        image: p.imageUrl || '',
      })),
    });
    return await newPuppies.save();
  }

  async update(id: string, dto: UpdatePuppiesDto): Promise<Puppies> {
    const patch: any = {
      mom: dto.mom,
      dad: dto.dad,
      breed: dto.breed,
      description: dto.description,
      metaTitle: dto.metaTitle,
      metaDescription: dto.metaDescription,
    };
    if (dto.imageUrl !== undefined) patch.image = dto.imageUrl;
    if (dto.puppies !== undefined) {
      patch.puppies = dto.puppies.map((p: any) => ({
        name: p.name,
        born: p.born,
        gender: p.gender,
        image: p.imageUrl || '',
      }));
    }
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    const result = await this.puppiesModel.findByIdAndUpdate(id, patch, { new: true }).exec();
    if (!result) throw new HttpException('Puppies not found', HttpStatus.NOT_FOUND);
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await this.puppiesModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new HttpException('Puppies not found', HttpStatus.NOT_FOUND);
  }

  async deleteSeveral(ids: string[]): Promise<void> {
    const result = await this.puppiesModel.deleteMany({ _id: { $in: ids } }).exec();
    if (result.deletedCount === 0) throw new HttpException('Puppies not found', HttpStatus.NOT_FOUND);
  }
}
