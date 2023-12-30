import { DogService } from './dog.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
export declare class DogController {
    private readonly dogService;
    constructor(dogService: DogService);
    create(createDogDto: CreateDogDto): Promise<import("./dog.model").Dog>;
    findOne(id: string): Promise<import("./dog.model").Dog>;
    findAll(): Promise<import("./dog.model").Dog[]>;
    update(id: string, updateDogDto: UpdateDogDto): Promise<import("./dog.model").Dog>;
    delete(id: string): Promise<void>;
}
