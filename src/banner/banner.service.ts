// src/banner/banner.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginationService } from '../common/services/pagination.service';
import { Banner, BannerDocument } from '../schemas/banner.schema';
import { CloudinaryService } from '../common/services/cloudinary.service';

@Injectable()
export class BannersService {
    constructor(
        @InjectModel('Banner') private bannerModel: Model<BannerDocument>,
        private readonly paginationService: PaginationService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async findPaginated(paginationDto: PaginationDto) {
        return this.paginationService.paginate(this.bannerModel, paginationDto);
    }

    async create(createBannerDto: any, file: Express.Multer.File) {
        const uploadResult: any = await this.cloudinaryService.uploadImage(file, 'banners');

        const createdBanner = new this.bannerModel({
            ...createBannerDto,
            // imageUrl: uploadResult.secure_url,
            imageUrl: uploadResult,
            cloudinaryPublicId: uploadResult.public_id
        });
        return createdBanner.save();
    }

    async findAll() {
        return this.bannerModel.find({ isDeleted: false }).exec();
    }

    async findOne(id: string) {
        return this.bannerModel.findOne({ _id: id, isDeleted: false }).exec();
    }

    async update(id: string, updateBannerDto: any, file?: Express.Multer.File) {
        const banner = await this.bannerModel.findById(id);
        if (!banner) {
            throw new NotFoundException(`Banner with ID "${id}" not found`);
        }

        if (file) {
            // Delete old image from Cloudinary
            await this.cloudinaryService.deleteImage(banner.cloudinaryPublicId);

            // Upload new image
            const uploadResult: any = await this.cloudinaryService.uploadImage(file, 'banners');
            updateBannerDto.imageUrl = uploadResult.secure_url;
            updateBannerDto.cloudinaryPublicId = uploadResult.public_id;
        }

        return this.bannerModel.findByIdAndUpdate(id, updateBannerDto, { new: true }).exec();
    }

    async softDelete(id: string): Promise<Banner> {
        const banner = await this.bannerModel.findById(id);
        if (!banner) {
            throw new NotFoundException(`Banner with ID "${id}" not found`);
        }
        banner.isDeleted = true;
        return banner.save();
    }

    async permanentDelete(id: string): Promise<Banner> {
        const banner = await this.bannerModel.findById(id);
        if (!banner) {
            throw new NotFoundException(`Banner with ID "${id}" not found`);
        }

        // Delete image from Cloudinary
        await this.cloudinaryService.deleteImage(banner.cloudinaryPublicId);

        // Delete banner from database
        return this.bannerModel.findByIdAndDelete(id).exec();
    }
}