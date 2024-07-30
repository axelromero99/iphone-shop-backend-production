// audit-log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AuditLog } from 'src/schemas/audit-log.schema';

@Injectable()
export class AuditLogService {
    constructor(@InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>) { }

    async log(logData: {
        url: string;
        method: string;
        body: any;
        user: any;
        response: any;
    }) {
        const auditLog = new this.auditLogModel(logData);
        await auditLog.save();
    }
    async getUserAuditLog(userId: string) {
        console.log('Buscando logs para el usuario:', userId);
        console.log('Tipo de userId:', typeof userId);

        // Intenta convertir el userId a ObjectId
        const objectId = new mongoose.Types.ObjectId(userId);
        console.log('userId como ObjectId:', objectId);

        const logs = await this.auditLogModel.find({ 'user._id': objectId }).sort({ createdAt: -1 }).exec();
        console.log('Logs encontrados:', logs.length);

        if (logs.length === 0) {
            // Si no se encuentran logs, busquemos todos los logs para ver qué hay en la base de datos
            const allLogs = await this.auditLogModel.find().exec();
            console.log('Total de logs en la base de datos:', allLogs.length);
            console.log('Muestra de los primeros 3 logs:', allLogs.slice(0, 3));
        }

        return logs;
    }
}