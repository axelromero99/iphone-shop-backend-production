// src/audit/audit-log.controller.ts
import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { AuthGuard } from '@nestjs/passport';

@Controller('audit-log')
export class AuditLogController {
    constructor(private readonly auditLogService: AuditLogService) { }

    @Get('user/:id')
    // @UseGuards(AuthGuard('jwt'))
    async getUserAuditLogById(@Param('id') id: string) {
        console.log("id", id);
        return this.auditLogService.getUserAuditLog(id);
    }

    @Get('user')
    // @UseGuards(AuthGuard('jwt'))
    async getCurrentUserAuditLog(@Req() req) {

        const userId = req.user.id;
        console.log("userId", userId);
        return this.auditLogService.getUserAuditLog(userId);
    }
}