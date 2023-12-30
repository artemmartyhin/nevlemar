/// <reference types="multer" />
import { Model } from 'mongoose';
import { Dog } from './dog.model';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
export declare class DogService {
    private readonly dogModel;
    constructor(dogModel: Model<Dog>);
    findAll(): Promise<Dog[]>;
    findOne(id: string): Promise<Dog>;
    findByGenderAndBreed(gender: string, breed: string): Promise<Dog[]>;
    create(createDogDto: CreateDogDto, file: Express.Multer.File): Promise<Dog>;
    update(id: string, updateDogDto: UpdateDogDto): Promise<Dog>;
    delete(id: string): Promise<void>;
    deleteSeveral(ids: string[]): Promise<void>;
}
