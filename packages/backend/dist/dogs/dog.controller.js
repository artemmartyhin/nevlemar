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
exports.DogController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const dog_service_1 = require("./dog.service");
const create_dog_dto_1 = require("./dto/create-dog.dto");
const update_dog_dto_1 = require("./dto/update-dog.dto");
const auth_admin_1 = require("../auth/auth.admin");
const multer = require("multer");
let DogController = class DogController {
    constructor(dogService) {
        this.dogService = dogService;
    }
    async create(file, createDogDto) {
        return await this.dogService.create(createDogDto, file);
    }
    async findOne(id) {
        return await this.dogService.findOne(id);
    }
    async findAll() {
        return await this.dogService.findAll();
    }
    async findByGenderAndBreed(breed, gender) {
        return await this.dogService.findByGenderAndBreed(gender, breed);
    }
    async update(id, updateDogDto) {
        return await this.dogService.update(id, updateDogDto);
    }
    async delete(id) {
        await this.dogService.delete(id);
    }
    async deleteSeveral(ids) {
        await this.dogService.deleteSeveral(ids);
    }
};
exports.DogController = DogController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_admin_1.AdminGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', { storage: multer.memoryStorage() })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_dog_dto_1.CreateDogDto]),
    __metadata("design:returntype", Promise)
], DogController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DogController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DogController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':breed/:gender'),
    __param(0, (0, common_1.Param)('breed')),
    __param(1, (0, common_1.Param)('gender')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DogController.prototype, "findByGenderAndBreed", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(auth_admin_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_dog_dto_1.UpdateDogDto]),
    __metadata("design:returntype", Promise)
], DogController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_admin_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DogController.prototype, "delete", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(auth_admin_1.AdminGuard),
    __param(0, (0, common_1.Body)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], DogController.prototype, "deleteSeveral", null);
exports.DogController = DogController = __decorate([
    (0, common_1.Controller)('dogs'),
    __metadata("design:paramtypes", [dog_service_1.DogService])
], DogController);
//# sourceMappingURL=dog.controller.js.map