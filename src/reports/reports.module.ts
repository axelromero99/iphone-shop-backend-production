
// src/report/report.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportService } from './reports.service';
import { ReportController } from './reports.controller';
import { ReportSchema } from 'src/schemas/report.schema';
import { CommonModule } from 'src/common/common.module';


@Module({
    imports: [MongooseModule.forFeature([{ name: 'Report', schema: ReportSchema }]),
        CommonModule,
    ],
    providers: [ReportService],
    controllers: [ReportController],
})
export class ReportsModule { }