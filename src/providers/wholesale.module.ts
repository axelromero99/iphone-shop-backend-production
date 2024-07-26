

// src/wholesale/wholesale.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WholesaleService } from './wholesale.service';
import { WholesaleController } from './wholesale.controller';
import { SupplierSchema } from '../schemas/supplier.schema';
import { WholesaleOrderSchema } from '../schemas/wholesale-order.schema';
import { WholesaleCustomerSchema } from '../schemas/wholesale-customer.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Supplier', schema: SupplierSchema },
            { name: 'WholesaleCustomer', schema: WholesaleCustomerSchema },
            { name: 'WholesaleOrder', schema: WholesaleOrderSchema },
        ]),
    ],
    providers: [WholesaleService],
    controllers: [WholesaleController],
})
export class WholesaleModule { }