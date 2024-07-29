// audit-log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from 'src/schemas/audit-log.schema';

@Injectable()
export class AuditLogService {
    constructor(@InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>) { }

    async log(logData: {
        url: string;
        method: string;
        body: any;
        userId: string;
        response: any;
    }) {
        const auditLog = new this.auditLogModel(logData);
        await auditLog.save();
    }
}