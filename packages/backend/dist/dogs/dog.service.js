"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DogService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
let DogService = class DogService {
    constructor(dogModel) {
        this.dogModel = dogModel;
    }
    async findAll() {
        return await this.dogModel.find().exec();
    }
    async findOne(id) {
        const dog = await this.dogModel.findById(id).exec();
        if (!dog) {
            throw new common_1.NotFoundException('Dog not found');
        }
        return dog;
    }
    async findByGenderAndBreed(gender, breed) {
        return await this.dogModel.find({
            breed: breed,
            gender: gender
        }).exec();
    }
    async create(createDogDto, file) {
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
    async update(id, updateDogDto) {
        const updatedDog = await this.dogModel
            .findByIdAndUpdate(id, updateDogDto, { new: true })
            .exec();
        if (!updatedDog) {
            throw new common_1.NotFoundException('Dog not found');
        }
        return updatedDog;
    }
    async delete(id) {
        const result = await this.dogModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Dog not found');
        }
    }
    async deleteSeveral(ids) {
        const result = await this.dogModel.deleteMany({ _id: { $in: ids } }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Dogs not found');
        }
    }
};
exports.DogService = DogService;
exports.DogService = DogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Dog')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DogService);
//# sourceMappingURL=dog.service.js.map