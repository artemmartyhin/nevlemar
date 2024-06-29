import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Puppies, Puppy } from './puppies.schema';
import { CreatePuppiesDto } from './dto/create-puppies.dto';
import { UpdatePuppiesDto } from './dto/update-puppies.dto';
import { FindPuppiesDto } from './dto/find-puppies.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class PuppiesService {
  constructor(
    @InjectModel('Puppies') private readonly puppiesModel: Model<Puppies>,
  ) {}

  async findAll(): Promise<Puppies[]> {
    return await this.puppiesModel.find().exec();
  }

  async findByOptions(dto: FindPuppiesDto): Promise<Puppies[]> {
    return await this.puppiesModel.find(dto).exec();
  }

  async findOne(id: string): Promise<Puppies> {
    const puppies = await this.puppiesModel.findById(id).exec();
    if (!puppies) {
      throw new HttpException('Puppies not found', HttpStatus.NOT_FOUND);
    }
    return puppies;
  }

  async create(
    dto: CreatePuppiesDto,
    files: Express.Multer.File[],
  ): Promise<Puppies> {
    const newPuppies = new this.puppiesModel({
      mom: dto.mom,
      dad: dto.dad,
      breed: dto.breed,
    });

    if (files && files.length > 0) {
      const uploadsDir = '/data/uploads';
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      if (files[0]) {
        const hashOuter = crypto.createHash('sha256');
        hashOuter.update(`${Date.now()}-${Math.random()}`);
        const hashedFilenameOuter = hashOuter.digest('hex').substring(0, 16);
        const fileExtensionOuter = path.extname(files[0].originalname);
        const uniqueFilenameOuter = `${hashedFilenameOuter}${fileExtensionOuter}`;

        const filePathOuter = path.join(uploadsDir, uniqueFilenameOuter);
        fs.writeFileSync(filePathOuter, files[0].buffer);

        newPuppies.image = uniqueFilenameOuter;
      }

      const puppiesArray: Puppy[] = [];
      for (let i = 1; i < files.length; i++) {
        if (files[i]) {
          const hash = crypto.createHash('sha256');
          hash.update(`${Date.now()}-${Math.random()}-${i}`);
          const hashedFilename = hash.digest('hex').substring(0, 16);
          const fileExtension = path.extname(files[i].originalname);
          const uniqueFilename = `${hashedFilename}${fileExtension}`;

          const filePath = path.join(uploadsDir, uniqueFilename);
          fs.writeFileSync(filePath, files[i].buffer);

          const puppy: Puppy = {
            name: dto.puppies[i - 1].name,
            born: dto.puppies[i - 1].born,
            gender: dto.puppies[i - 1].gender,
            image: uniqueFilename,
          };

          puppiesArray.push(puppy);
        }
      }

      newPuppies.puppies = puppiesArray;
    }

    return await newPuppies.save();
  }

  async update(id: string, dto: UpdatePuppiesDto): Promise<Puppies> {
    const updatedPuppies = await this.puppiesModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updatedPuppies) {
      throw new HttpException('Puppies not found', HttpStatus.NOT_FOUND);
    }
    return updatedPuppies;
  }

  async delete(id: string): Promise<void> {
    const result = await this.puppiesModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Puppies not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteSeveral(ids: string[]): Promise<void> {
    const result = await this.puppiesModel
      .deleteMany({ _id: { $in: ids } })
      .exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Puppies not found', HttpStatus.NOT_FOUND);
    }
  }
}
