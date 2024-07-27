
// src/banner/banner.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { CreateExpenseDto } from './dto/create-expense.dto';
// import { UpdateExpenseDto } from './dto/update-expense.dto';
import { PaginationDto, SortOrder } from 'src/common/dtos/pagination.dto';

import { PaginationService } from 'src/common/services/pagination.service';
import { Expense } from 'src/schemas/expense.schema';



@Injectable()
export class BannersService {
    constructor(@InjectModel('Expense') private expenseModel: Model<any>,
        private readonly paginationService: PaginationService,

    ) { }

    async findPaginated(paginationDto: PaginationDto) {
        return this.paginationService.paginate(this.expenseModel, paginationDto);
    }

    async create(createExpenseDto: any) {
        const createdExpense = new this.expenseModel(createExpenseDto);
        return createdExpense.save();
    }

    async findAll() {
        return this.expenseModel.find().exec();
    }

    async findOne(id: string) {
        return this.expenseModel.findById(id).exec();
    }

    async update(id: string, updateExpenseDto: any) {
        return this.expenseModel.findByIdAndUpdate(id, updateExpenseDto, { new: true }).exec();
    }

    async softDelete(id: string): Promise<Expense> {
        const expense = await this.expenseModel.findById(id);
        if (!expense) {
            throw new NotFoundException(`InventoryItem with ID "${id}" not found`);
        }
        expense.isDeleted = true;
        return expense.save();
    }

    async permanentDelete(id: string): Promise<Expense> {
        const expense = await this.expenseModel.findByIdAndDelete(id).exec();
        if (!expense) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        return expense;
    }

}