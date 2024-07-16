import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Puppies, Puppy } from './puppies.schema';
import { CreatePuppiesDto } from './dto/create-puppies.dto';
import { UpdatePuppiesDto } from './dto/update-puppies.dto';
import { FindPuppiesDto } from './dto/find-puppies.dto';

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

  private generateFilename(originalname: string, prefix: string): string {
    const timestamp = Date.now();
    const hash = crypto.createHash('sha256');
    hash.update(`${timestamp}-${Math.random()}`);
    const hashedFilename = hash.digest('hex').substring(0, 16);
    const fileExtension = path.extname(originalname);
    return `${hashedFilename}-${prefix}_${timestamp}${fileExtension}`;
  }

  async create(
    dto: CreatePuppiesDto,
    files: Express.Multer.File[],
  ): Promise<Puppies> {
    const newPuppies = new this.puppiesModel({
      mom: dto.mom,
      dad: dto.dad,
      breed: dto.breed,
      description: dto.description,
    });

    if (files && files.length > 0) {
      const uploadsDir = '/data/uploads';
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Save the main image
      const mainImageFile = files[0];
      if (mainImageFile) {
        const uniqueFilename = this.generateFilename(mainImageFile.originalname, 'mainImage');
        const filePath = path.join(uploadsDir, uniqueFilename);
        fs.writeFileSync(filePath, mainImageFile.buffer);
        newPuppies.image = uniqueFilename;
      }

      // Save puppies images
      const puppiesArray: Puppy[] = dto.puppies.map((puppy, index) => {
        const puppyImageFile = files[index + 1];
        let uniqueFilename = '';
        if (puppyImageFile) {
          uniqueFilename = this.generateFilename(puppyImageFile.originalname, `puppyImage${index}`);
          const filePath = path.join(uploadsDir, uniqueFilename);
          fs.writeFileSync(filePath, puppyImageFile.buffer);
        }

        return {
          name: puppy.name,
          born: puppy.born,
          gender: puppy.gender,
          image: uniqueFilename,
        };
      });

      newPuppies.puppies = puppiesArray;
    }

    return await newPuppies.save();
  }

  async update(
    id: string,
    dto: UpdatePuppiesDto,
    files: Express.Multer.File[],
  ): Promise<Puppies> {
    const puppies = await this.findOne(id);

    const updatedPuppies: any = {
      mom: dto.mom,
      dad: dto.dad,
      breed: dto.breed,
      description: dto.description,
    };

    const uploadsDir = '/data/uploads';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const existingPuppies = puppies.puppies;

    if (files && files.length > 0) {
      // Main image
      const mainImageFile = files.find(
        (file) => file.originalname.includes('mainImage'),
      );
      if (mainImageFile) {
        const uniqueFilename = this.generateFilename(mainImageFile.originalname, 'mainImage');
        const filePath = path.join(uploadsDir, uniqueFilename);
        fs.writeFileSync(filePath, mainImageFile.buffer);
        updatedPuppies.image = uniqueFilename;
      } else {
        updatedPuppies.image = puppies.image;
      }

      // Puppy images
      const puppiesArray: Puppy[] = dto.puppies.map((puppy, index) => {
        const puppyImageFile = files.find(
          (file) => file.originalname.includes(`puppyImage${index}`),
        );
        if (puppyImageFile) {
          const uniqueFilename = this.generateFilename(puppyImageFile.originalname, `puppyImage${index}`);
          const filePath = path.join(uploadsDir, uniqueFilename);
          fs.writeFileSync(filePath, puppyImageFile.buffer);
          return {
            name: puppy.name,
            born: puppy.born,
            gender: puppy.gender,
            image: uniqueFilename,
          };
        } else if (existingPuppies[index]) {
          return {
            name: puppy.name,
            born: puppy.born,
            gender: puppy.gender,
            image: existingPuppies[index].image,
          };
        } else {
          return {
            name: puppy.name,
            born: puppy.born,
            gender: puppy.gender,
            image: '', // Ensure image is defined
          };
        }
      });

      updatedPuppies.puppies = puppiesArray;
    } else {
      updatedPuppies.puppies = dto.puppies.map((puppy, index) => ({
        ...puppy,
        name: puppy.name || '',
        born: puppy.born || new Date(),
        gender: puppy.gender || '',
        image: existingPuppies[index] ? existingPuppies[index].image : '', // Preserve existing images
      }));
    }

    const result = await this.puppiesModel
      .findByIdAndUpdate(id, updatedPuppies, { new: true })
      .exec();

    if (!result) {
      throw new HttpException('Puppies not found', HttpStatus.NOT_FOUND);
    }

    return result;
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
