
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


    async openShift(openShiftDto: any): Promise<CashRegister> {
        const newShift = new this.cashRegisterModel(openShiftDto);
        return newShift.save();
    }

    async closeShift(id: string, closeShiftDto: any): Promise<CashRegister> {
        const shift = await this.cashRegisterModel.findById(id);
        if (!shift || shift.isClosed) {
            throw new NotFoundException(`Shift with ID "${id}" not found or already closed`);
        }
        Object.assign(shift, closeShiftDto);
        shift.isClosed = true;
        shift.closingTime = new Date();
        return shift.save();
    }

    async getDailyReport(date: Date): Promise<any> {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const shifts = await this.cashRegisterModel.find({
            openingTime: { $gte: startOfDay, $lte: endOfDay },
            isClosed: true
        }).exec();

        // Calcular totales y generar informe
        // ...

        return {
            date: date,
            totalSales: /* cálculo */,
            totalCash: /* cálculo */,
            totalCredit: /* cálculo */,
            totalDebit: /* cálculo */,
            totalOther: /* cálculo */,
            netProfit: /* cálculo */,
            shifts: shifts
        };
    }

    async getShiftReport(id: string): Promise<any> {
        const shift = await this.cashRegisterModel.findById(id);
        if (!shift) {
            throw new NotFoundException(`Shift with ID "${id}" not found`);
        }

        // Generar informe detallado del turno
        // ...

        return {
            shiftId: shift._id,
            cashier: shift.cashier,
            shift: shift.shift,
            openingTime: shift.openingTime,
            closingTime: shift.closingTime,
            openingBalance: shift.openingBalance,
            closingBalance: shift.closingBalance,
            salesBreakdown: {
                cash: shift.cashInDrawer - shift.openingBalance,
                creditCard: shift.creditCardTotal,
                debitCard: shift.debitCardTotal,
                other: shift.otherPaymentTotal
            },
            totalSales: shift.closingBalance - shift.openingBalance,
            discrepancy: shift.discrepancy,
            notes: shift.notes
        };
    }
}
