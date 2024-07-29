import { Module } from '@nestjs/common';
import { PaginationService } from './services/pagination.service';
import { CloudinaryService } from './services/cloudinary.service';

@Module({
    providers: [PaginationService, CloudinaryService],
    exports: [PaginationService, CloudinaryService]
})
export class CommonModule { }

