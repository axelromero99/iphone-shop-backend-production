
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { CreateCashRegisterDto } from './dto/create-cash-register.dto';
// import { UpdateCashRegisterDto } from './dto/update-cash-register.dto';

@Injectable()
export class CashRegisterService {
    constructor(@InjectModel('CashRegister') private cashRegisterModel: Model<any>) { }

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

    // async remove(id: string) {
    //     return this.cashRegisterModel.findByIdAndRemove(id).exec();
    // }
}
