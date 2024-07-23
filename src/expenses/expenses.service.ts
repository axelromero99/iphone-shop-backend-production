
// src/expenses/expenses.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { CreateExpenseDto } from './dto/create-expense.dto';
// import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
    constructor(@InjectModel('Expense') private expenseModel: Model<any>) { }

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