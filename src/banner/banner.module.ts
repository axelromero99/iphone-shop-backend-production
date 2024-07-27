
// src/banner/banner.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BannersService } from './banner.service';
import { BannersController } from './banner.controller';
import { ExpenseSchema } from '../schemas/expense.schema';
import { CommonModule } from 'src/common/common.module';


@Module({
    imports: [MongooseModule.forFeature([{ name: 'Expense', schema: ExpenseSchema }]),
        CommonModule,
    ],
    providers: [BannersService],
    controllers: [BannersController],
})
export class BannersModule { }