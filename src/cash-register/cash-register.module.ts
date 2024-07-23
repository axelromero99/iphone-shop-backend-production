import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CashRegisterService } from './cash-register.service';
import { CashRegisterController } from './cash-register.controller';
import { CashRegisterSchema } from '../schemas/cash-register.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'CashRegister', schema: CashRegisterSchema }])],
    providers: [CashRegisterService],
    controllers: [CashRegisterController],
})
export class CashRegisterModule { }