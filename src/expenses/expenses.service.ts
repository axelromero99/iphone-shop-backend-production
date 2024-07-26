
// src/expenses/expenses.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { CreateExpenseDto } from './dto/create-expense.dto';
// import { UpdateExpenseDto } from './dto/update-expense.dto';
import { PaginationDto, SortOrder } from 'src/common/dtos/pagination.dto';

import { PaginationService } from 'src/common/services/pagination.service';



@Injectable()
export class ExpensesService {
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

    // async remove(id: string) {
    //     return this.expenseModel.findByIdAndRemove(id).exec();
    // }
}