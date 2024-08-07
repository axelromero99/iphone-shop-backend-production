// src/cash-register/cash-register.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CashRegisterService } from './cash-register.service';
import { CashRegisterController } from './cash-register.controller';
import { CashRegister, CashRegisterSchema } from 'src/schemas/cash-register.schema';
import { Transaction, TransactionSchema } from 'src/schemas/transaction.schema';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CashRegister.name, schema: CashRegisterSchema },
            { name: Transaction.name, schema: TransactionSchema }
        ]),
        CommonModule,
    ],
    providers: [CashRegisterService],
    controllers: [CashRegisterController],
    exports: [CashRegisterService],
})
export class CashRegisterModule { }