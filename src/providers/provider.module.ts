

// src/provider/provider.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProvidersService } from './provider.service';
import { ProvidersController } from './provider.controller';
import { ProviderSchema } from '../schemas/provider.schema';
import { CommonModule } from '../common/common.module';
import { InventoryModule } from '../inventory/inventory.module';
import { ProductsModule } from '../products/products.module';
import { CashRegisterModule } from '../cash-register/cash-register.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Provider', schema: ProviderSchema },
        ]),
        CashRegisterModule,
        ProductsModule,
        InventoryModule,

        CommonModule,

    ],

    providers: [ProvidersService],
    controllers: [ProvidersController],
})
export class ProviderModule { }