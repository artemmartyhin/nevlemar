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
    create(createDogDto: CreateDogDto): Promise<Dog>;
    update(id: string, updateDogDto: UpdateDogDto): Promise<Dog>;
    delete(id: string): Promise<void>;
}
