import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CashRegisterService } from './cash-register.service';
import { CashRegisterController } from './cash-register.controller';
import { CashRegister, CashRegisterSchema } from '../schemas/cash-register.schema';
import { Transaction, TransactionSchema } from '../schemas/transaction.schema';
import { CashClosing, CashClosingSchema } from '../schemas/cash-closing.schema';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CashRegister.name, schema: CashRegisterSchema },
            { name: Transaction.name, schema: TransactionSchema },
            { name: CashClosing.name, schema: CashClosingSchema }
        ]),
        CommonModule,
    ],
    providers: [CashRegisterService],
    controllers: [CashRegisterController],
    exports: [CashRegisterService],
})
export class CashRegisterModule { }