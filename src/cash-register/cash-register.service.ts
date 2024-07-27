
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { CreateCashRegisterDto } from './dto/create-cash-register.dto';
// import { UpdateCashRegisterDto } from './dto/update-cash-register.dto';
import { PaginationDto, SortOrder } from 'src/common/dtos/pagination.dto';

import { PaginationService } from 'src/common/services/pagination.service';
import { CashRegister } from 'src/schemas/cash-register.schema';


@Injectable()
export class CashRegisterService {
    constructor(@InjectModel('CashRegister') private cashRegisterModel: Model<any>,
        private readonly paginationService: PaginationService,
    ) { }


    async findPaginated(paginationDto: PaginationDto) {
        return this.paginationService.paginate(this.cashRegisterModel, paginationDto);
    }

    async create(createCashRegisterDto: any) {
        const createdCashRegister = new this.cashRegisterModel(createCashRegisterDto);
        return createdCashRegister.save();
    }

    async findAll() {
        return this.cashRegisterModel.find().exec();
    }

    async findOne(id: string) {
        return this.cashRegisterModel.findById(id).exec();
    }

    async update(id: string, updateCashRegisterDto: any) {
        return this.cashRegisterModel.findByIdAndUpdate(id, updateCashRegisterDto, { new: true }).exec();
    }

    async softDelete(id: string): Promise<CashRegister> {
        const cashRegister = await this.cashRegisterModel.findById(id);
        if (!cashRegister) {
            throw new NotFoundException(`InventoryItem with ID "${id}" not found`);
        }
        cashRegister.isDeleted = true;
        return cashRegister.save();
    }

    async permanentDelete(id: string): Promise<CashRegister> {
        const cashRegister = await this.cashRegisterModel.findByIdAndDelete(id).exec();
        if (!cashRegister) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        return cashRegister;
    }
}
